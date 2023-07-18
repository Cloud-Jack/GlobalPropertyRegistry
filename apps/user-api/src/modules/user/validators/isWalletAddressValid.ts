import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ethers } from 'ethers';
import { ApiException } from 'libs/utils';

@ValidatorConstraint({ name: 'isWalletAddressValid', async: false })
@Injectable()
export class IsWalletAddressValid implements ValidatorConstraintInterface {
  validate(address: string): boolean {
    if (address.length !== 42)
      throw new ApiException('address length must be 42 (starts with "0x")', HttpStatus.PRECONDITION_FAILED);
    if (!ethers.isAddress(address)) throw new ApiException('invalid wallet address', HttpStatus.PRECONDITION_FAILED);
    return true;
  }
}
