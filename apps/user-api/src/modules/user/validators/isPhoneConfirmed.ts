import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ApiException } from 'libs/utils';

import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'isPhoneConfirmed', async: true })
@Injectable()
export class IsPhoneConfirmed implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(phone: string): Promise<boolean> {
    return this.userService.getBy({ phone }).then((user) => {
      if (!user) {
        throw new ApiException('user not found', HttpStatus.PRECONDITION_FAILED);
      } else if (!user.isPhoneConfirmed) {
        throw new ApiException('phone number not confirmed', HttpStatus.PRECONDITION_FAILED);
      } else {
        return true;
      }
    });
  }
}
