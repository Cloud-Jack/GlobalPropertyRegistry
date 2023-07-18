import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnapshotModule } from 'libs/modules/database/mongo/repository-modules/snapshot/snapshot.module';
import { LoggerModule } from 'libs/modules/global/logger/module';

import { AdminController } from './admin.controller';
import { UserEntity } from './entity/user.entity';
import { OwnerController } from './owner.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IsBirthOfDayFormat } from './validators/isBirthOfDayFormat';
import { IsEmailAlreadyExist } from './validators/isEmailAlreadyExist';
import { IsPhoneAlreadyExist } from './validators/isPhoneAlreadyExist';
import { IsPhoneConfirmed } from './validators/isPhoneConfirmed';
import { IsUserTheFoundById } from './validators/isUserTheFoundById';
import { IsUserTheFoundByPhone } from './validators/isUserTheFoundByPhone';
import { IsWalletAddressAlreadyExist, IsWalletAddressExistPositive } from './validators/isWalletAddressAlreadyExist';
import { IsWalletAddressValid } from './validators/isWalletAddressValid';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SnapshotModule, LoggerModule],
  providers: [
    UserService,
    IsBirthOfDayFormat,
    IsPhoneAlreadyExist,
    IsUserTheFoundByPhone,
    IsUserTheFoundById,
    IsPhoneConfirmed,
    IsWalletAddressAlreadyExist,
    IsWalletAddressExistPositive,
    IsWalletAddressValid,
    IsEmailAlreadyExist,
  ],
  exports: [UserService],
  controllers: [UserController, AdminController, OwnerController],
})
export class UserModule {}
