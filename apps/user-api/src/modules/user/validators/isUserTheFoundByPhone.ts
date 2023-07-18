import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ApiException } from 'libs/utils';

import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'isUserTheFoundByPhone', async: true })
@Injectable()
export class IsUserTheFoundByPhone implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(phone: string): Promise<boolean> {
    return this.userService.getBy({ phone }).then((user) => {
      if (!user) {
        throw new ApiException('user with this phone not found', HttpStatus.PRECONDITION_FAILED);
      } else {
        return true;
      }
    });
  }
}
