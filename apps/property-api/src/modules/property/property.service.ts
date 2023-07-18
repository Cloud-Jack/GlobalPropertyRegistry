import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'apps/user-api/src/modules/user/user.service';
import { SnapshotsRepository } from 'libs/modules/database/mongo/repository-modules/snapshot/snapshot.repository';
import { LoggerService } from 'libs/modules/global/logger/service';
import { Repository } from 'typeorm';

import { PropertyDTO } from './property.dto';
import { PropertyEntity } from './property.entity';

@Injectable()
export class PropertyApiService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly properties: Repository<PropertyEntity>,
    private readonly snapshots: SnapshotsRepository,
    private readonly logger: LoggerService,
    private readonly users: UserService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createProperty(propertyDTO: PropertyDTO): Promise<PropertyEntity> {
    this.logger.info({ message: JSON.stringify(propertyDTO) });
    const owner = await this.users.getBy({ walletAddress: propertyDTO.ownerAddress });
    const property = this.properties.create({ ...propertyDTO, owner });
    return this.properties.save(property);
  }
}
