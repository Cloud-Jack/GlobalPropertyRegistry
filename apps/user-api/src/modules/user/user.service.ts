import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBoolean } from 'class-validator';
import { SnapshotsRepository } from 'libs/modules/database/mongo/repository-modules/snapshot/snapshot.repository';
import {
  EntityName,
  ServiceName,
  SnapshotAction,
} from 'libs/modules/database/mongo/repository-modules/snapshot/snapshot.schema';
import { LoggerService } from 'libs/modules/global/logger/service';
import { ApiException } from 'libs/utils';
import { paginate } from 'nestjs-typeorm-paginate/index';
import { FindOptionsWhere, ILike, Repository, UpdateResult } from 'typeorm';

import {
  CreateUserDTO,
  GetAllUsersDTO,
  GetAllUsersFilterDTO,
  UpdateUserDTO,
  UpdateUserRestrictedDTO,
} from './dto/index';
import { UserEntity, UserRole } from './entity/user.entity';
// import { parseUserDataInput } from './utils/index';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly snapshots: SnapshotsRepository,
    private readonly logger: LoggerService,
  ) {}

  async getBy(options: FindOptionsWhere<UserEntity> = {}, requester?: UserEntity): Promise<UserEntity | undefined> {
    const searchedUser = await this.users.findOneBy(options);
    if (requester && requester.role !== UserRole.OWNER && searchedUser.role === UserRole.OWNER) return undefined;
    return searchedUser;
  }

  // eslint-disable-next-line complexity
  getAll(user: UserEntity, body?: GetAllUsersDTO) {
    const { filter, sort, pagination } = body;
    const _filter: Partial<GetAllUsersFilterDTO> = { ...filter };
    if (user.role === UserRole.ADMIN) _filter.role = UserRole.USER;
    const parsedWhere: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity> = {
      ...(_filter.firstName && { firstName: ILike(`%${_filter.firstName}%`) }),
      ...(_filter.lastName && { lastName: ILike(`%${_filter.lastName}%`) }),
      ...(_filter.locale && { locale: ILike(`%${_filter.locale}%`) }),
      ...(Number.isInteger(_filter.role) && { role: _filter.role }),
      ...(Number.isInteger(_filter.status) && { status: _filter.status }),
      ...(isBoolean(_filter.verified) && { verified: _filter.verified }),
      ...(isBoolean(_filter.isEmailConfirmed) && { isEmailConfirmed: _filter.isEmailConfirmed }),
      ...(isBoolean(_filter.isPhoneConfirmed) && { isPhoneConfirmed: _filter.isPhoneConfirmed }),
    };
    return paginate<UserEntity>(this.users, pagination, {
      order: sort ? { [sort.field]: sort.desc ? 'DESC' : 'ASC' } : { id: 'DESC' },
      where: parsedWhere,
    });
  }

  getWithRefreshToken(id: number, walletAddress: string, refreshToken: string): Promise<UserEntity> {
    return this.users.findOne({
      where: { id, walletAddress, hashedRefreshToken: refreshToken },
      select: { hashedRefreshToken: true, id: true, walletAddress: true },
    });
  }

  async isPhoneConfirmed(phone: string): Promise<boolean> {
    const user = await this.users.findOne({ where: { phone } });
    return user.isPhoneConfirmed;
  }

  async create(payload: CreateUserDTO): Promise<UserEntity> {
    const user = await this.users.create(payload);
    return this.users.save(user);
  }

  async updateByAdmin(who: UserEntity, whomId: number, payload: Partial<UpdateUserDTO>): Promise<UserEntity> {
    const toUpdate = await this.users.findOneOrFail({ where: { id: whomId } });
    if (who.role === UserRole.OWNER && toUpdate.role === UserRole.USER) {
      throw new ApiException('roles conflict', HttpStatus.CONFLICT);
    } else if (who.role === UserRole.ADMIN && toUpdate.role !== UserRole.USER)
      throw new ApiException('roles conflict', HttpStatus.CONFLICT);

    const user = this.users.create({ ...toUpdate, ...payload });
    const result = await this.users.save(user);
    this.createActionSnapshot(SnapshotAction.UPDATE, who, result);
    return result;
  }

  async updateByUser(id: number, payload: Partial<UpdateUserRestrictedDTO>): Promise<UserEntity> {
    const userToUpdate = await this.users.findOneOrFail({ where: { id } });
    const user = this.users.create({ ...userToUpdate, ...payload });
    const result = await this.users.save(user);
    this.createActionSnapshot(SnapshotAction.UPDATE, userToUpdate, result);
    return result;
  }

  async suspend(initiator: UserEntity, id: number) {
    if (initiator.id === id) throw new ApiException('self deleting impossible', HttpStatus.CONFLICT);
    const user = await this.users.findOneOrFail({ where: { id } });
    /* TODO: 
    - check for relations, demand transfer of them if exist (update delegated_to);
    - new entity should not contain unique fields!
    - move entity to deleted_users table
    - save snapshot of action
     */
    this.createActionSnapshot(SnapshotAction.DELETE, initiator, user);
    return { success: true };
  }

  setHashedRefreshToken(id: number, hashedRefreshToken: string): Promise<UpdateResult> {
    return this.users.update(id, { hashedRefreshToken });
  }

  async confirmUserEmail(email: string): Promise<boolean> {
    await this.users.update({ email }, { isEmailConfirmed: true });
    return true;
  }

  async confirmUserPhone(id: number): Promise<boolean> {
    await this.users.update({ id }, { isPhoneConfirmed: true });
    return true;
  }

  getUserProfileData(user: UserEntity): Partial<UserEntity> {
    const {
      id,
      walletAddress,
      phone,
      email,
      firstName,
      lastName,
      dateOfBirth,
      isEmailConfirmed,
      isPhoneConfirmed,
      description,
      locale,
      createdAt,
      updatedAt,
    } = user;
    return {
      id,
      walletAddress,
      phone,
      email,
      firstName,
      lastName,
      dateOfBirth,
      isEmailConfirmed,
      isPhoneConfirmed,
      description,
      locale,
      createdAt,
      updatedAt,
    };
  }

  async createActionSnapshot(action: SnapshotAction, initiator, target) {
    this.snapshots
      .create({
        action,
        service: ServiceName.USER,
        entity: EntityName.USER,
        initiator,
        target,
        date: Date.now(),
      })
      .catch(() => {
        this.logger.error(new ApiException('createActionSnapshot failed!'));
      });
  }
}
