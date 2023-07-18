import { ApiProperty } from '@nestjs/swagger';
import { IsWalletAddressValid } from 'apps/user-api/src/modules/user/validators/isWalletAddressValid';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, Validate } from 'class-validator';
import { Polygon } from 'geojson';

import { parseLocationString } from './property.validator';

export class PropertyDTO {
  @ApiProperty()
  @Validate(IsWalletAddressValid)
  contract: string;

  @ApiProperty()
  @Validate(IsWalletAddressValid)
  factoryNode: string;

  @ApiProperty()
  @Validate(IsWalletAddressValid)
  globalFactory: string;

  @ApiProperty()
  @Validate(IsWalletAddressValid)
  ownerAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((param) => parseLocationString(param.value))
  location: Polygon;

  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  postcode: string;

  @ApiProperty()
  @IsNotEmpty()
  localAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  price: string;

  @ApiProperty()
  @Validate(IsWalletAddressValid)
  currency: string;

  @ApiProperty()
  @IsBoolean()
  isForSell: boolean;

  @ApiProperty()
  @IsInt()
  createdAt: number;

  @ApiProperty()
  @IsInt()
  updatedAt: number;
}
