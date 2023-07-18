import { PropertyEntity } from 'apps/property-api/src/modules/property/property.entity';
import { Exclude } from 'class-transformer';
import { IsEmail, IsPhoneNumber, Validate } from 'class-validator';
import { BaseEntity } from 'libs/utils/entity/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';

import { IsWalletAddressValid } from '../validators/isWalletAddressValid';

export interface UserValidationDTO {
  readonly phone: string;
  readonly password: string;
}

export interface UserTokensInterface {
  readonly user?: Partial<UserEntity>;
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface UserUpdateTokensInterface {
  readonly userId: number;
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface UserUpdateTokensDTO {
  readonly userID: number;
  readonly phone: string;
  readonly refreshToken: string;
}

export interface UserJwtPayload {
  readonly id: number;
  readonly walletAddress: string;
}

export enum UserStatus {
  'GOOD',
  'WARN',
  'BAD',
}

export enum UserRole {
  'USER',
  'ADMIN',
  'OWNER',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ length: 42, type: 'varchar', unique: true })
  @Index()
  @Validate(IsWalletAddressValid)
  walletAddress: string;

  @Column({ length: 64, type: 'varchar', unique: true })
  @Index()
  @IsPhoneNumber()
  phone: string;

  @Column({ type: 'boolean', default: false })
  isPhoneConfirmed: boolean;

  @Column({ type: 'varchar', unique: true })
  @Index()
  @IsEmail()
  email: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ length: 64, type: 'varchar' })
  firstName: string;

  @Column({ length: 64, type: 'varchar' })
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Exclude()
  @Column({ nullable: true, select: false })
  hashedRefreshToken: string;

  @Column({ type: 'varchar', nullable: true })
  locale: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.GOOD })
  status: UserStatus;

  @Column({ default: false })
  verified: boolean;

  @OneToOne(() => UserEntity)
  delegatedTo: UserEntity;

  @BeforeInsert()
  @BeforeUpdate()
  transformPropertiesCase() {
    this.firstName = this.firstName.toUpperCase();
    this.lastName = this.lastName.toUpperCase();
    this.walletAddress = this.walletAddress.toLowerCase();
  }

  @OneToMany(() => PropertyEntity, (prop) => prop.ownerAddress, {
    onUpdate: 'CASCADE',
    onDelete: 'DEFAULT',
  })
  properties: PropertyEntity[];
}
