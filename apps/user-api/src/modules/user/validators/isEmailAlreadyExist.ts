import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ApiException } from 'libs/utils';

import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'isEmailAlreadyExist', async: true })
@Injectable()
export class IsEmailAlreadyExist implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string): Promise<boolean> {
    return this.userService.getBy({ email }).then((user) => {
      if (user) {
        throw new ApiException('user with this email already exist', HttpStatus.PRECONDITION_FAILED);
      } else {
        return true;
      }
    });
  }
}
