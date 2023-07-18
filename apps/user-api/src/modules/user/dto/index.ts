import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { GetAll } from 'libs/utils/dto/pagination.dto';

import { UserEntity, UserRole, UserStatus } from '../entity/user.entity';
import { parseDateInput } from '../utils/index';
import { IsBirthOfDayFormat } from '../validators/isBirthOfDayFormat';
import { IsEmailAlreadyExist } from '../validators/isEmailAlreadyExist';
import { IsPhoneAlreadyExist } from '../validators/isPhoneAlreadyExist';
import { IsUserTheFoundById } from '../validators/isUserTheFoundById';
import { IsWalletAddressAlreadyExist, IsWalletAddressExistPositive } from '../validators/isWalletAddressAlreadyExist';
import { IsWalletAddressValid } from '../validators/isWalletAddressValid';

const MSG_ONLY_LETTERS_OR_DASHES = 'name can only contain letters or dashes';

export class WalletAddressDTO {
  @ApiProperty()
  @Validate(IsWalletAddressValid)
  @Transform((param) => param.value.toLowerCase())
  walletAddress: string;
}

export class WalletAddressAndExistsDTO {
  @ApiProperty()
  @Validate(IsWalletAddressValid)
  @Validate(IsWalletAddressAlreadyExist)
  @Transform((param) => param.value.toLowerCase())
  walletAddress: string;
}

export class WalletAddressAndExistsPositiveDTO {
  @ApiProperty()
  @Validate(IsWalletAddressValid)
  @Validate(IsWalletAddressExistPositive)
  @Transform((param) => param.value.toLowerCase())
  walletAddress: string;
}

export class BaseUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(42)
  @Validate(IsWalletAddressValid)
  @Transform((param) => param.value.toLowerCase())
  walletAddress: string;

  @ApiProperty()
  @IsString()
  @MaxLength(24)
  @MinLength(1)
  @Matches(/^[A-Za-z-]*$/, { message: MSG_ONLY_LETTERS_OR_DASHES })
  @Transform((param) => param.value.toUpperCase())
  firstName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(24)
  @MinLength(1)
  @Matches(/^[A-Za-z-]*$/, { message: MSG_ONLY_LETTERS_OR_DASHES })
  @Transform((param) => param.value.toUpperCase())
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Validate(IsBirthOfDayFormat)
  @Transform((param) => parseDateInput(param.value))
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  @MaxLength(1024)
  @MinLength(1)
  description: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  @MinLength(2)
  locale: string;

  @ApiProperty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty()
  @IsBoolean()
  verified: boolean;

  @ApiProperty()
  @IsBoolean()
  isPhoneConfirmed: boolean;

  @ApiProperty()
  @IsBoolean()
  isEmailConfirmed: boolean;
}

export class CreateUserDTO extends PickType(BaseUserDTO, [
  'walletAddress',
  'email',
  'phone',
  'firstName',
  'lastName',
  'dateOfBirth',
] as const) {
  @Validate(IsWalletAddressValid)
  @Validate(IsWalletAddressAlreadyExist)
  walletAddress: string;

  @IsEmail()
  @Validate(IsEmailAlreadyExist)
  email: string;

  @IsPhoneNumber()
  @Matches(/^\+[1-9]\d{1,14}$/)
  @Validate(IsPhoneAlreadyExist)
  phone: string;
}

export class LoginUserDTO extends WalletAddressAndExistsPositiveDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  signature: string;
}

export class UpdateUserRestrictedDTO extends PartialType(
  PickType(BaseUserDTO, ['description', 'email', 'phone', 'locale'] as const),
) {}

export class UpdateUserDTO extends PartialType(
  PickType(BaseUserDTO, [
    'firstName',
    'lastName',
    'walletAddress',
    'dateOfBirth',
    'isEmailConfirmed',
    'isPhoneConfirmed',
    'role',
    'status',
    'verified',
  ] as const),
) {}

export class UserUpdateTokensDTO extends WalletAddressAndExistsPositiveDTO {
  @ApiProperty()
  @IsNumber()
  @Validate(IsUserTheFoundById)
  readonly userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}

export class ResponseUserDto implements Partial<UserEntity> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  walletAddress: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  isEmailConfirmed: boolean;

  @ApiProperty()
  isPhoneConfirmed: boolean;

  @ApiProperty()
  locale: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetAllUsersFilterDTO extends PartialType(
  PickType(BaseUserDTO, [
    'isPhoneConfirmed',
    'isEmailConfirmed',
    'verified',
    'locale',
    'status',
    'role',
    'firstName',
    'lastName',
  ] as const),
) {}

export class GetAllUsersDTO extends GetAll<UserEntity> {
  @ApiPropertyOptional()
  @IsOptional()
  filter: GetAllUsersFilterDTO;
}

export class QueryUserGetByDTO extends PartialType(WalletAddressDTO) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform((param) => Number(param.value))
  id: number;
}
