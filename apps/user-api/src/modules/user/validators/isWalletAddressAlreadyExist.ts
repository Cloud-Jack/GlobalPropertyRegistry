import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ApiException } from 'libs/utils';

import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'isWalletAddressAlreadyExist', async: true })
@Injectable()
export class IsWalletAddressAlreadyExist implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(address: string): Promise<boolean> {
    return this.userService.getBy({ walletAddress: address }).then((user) => {
      if (user) {
        throw new ApiException('user with this address already exist', HttpStatus.PRECONDITION_FAILED);
      } else {
        return true;
      }
    });
  }
}

@ValidatorConstraint({ name: 'isWalletAddressExistPositive', async: true })
@Injectable()
export class IsWalletAddressExistPositive implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(address: string): Promise<boolean> {
    return this.userService.getBy({ walletAddress: address }).then((user) => {
      if (user) {
        return true;
      } else {
        throw new ApiException('unknown address', HttpStatus.PRECONDITION_FAILED);
      }
    });
  }
}
