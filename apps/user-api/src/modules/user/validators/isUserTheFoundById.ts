import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ApiException } from 'libs/utils';

import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'isUserTheFoundById', async: true })
@Injectable()
export class IsUserTheFoundById implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(id: number): Promise<boolean> {
    return this.userService.getBy({ id }).then((user) => {
      if (!user) {
        throw new ApiException('user with this id not found', HttpStatus.PRECONDITION_FAILED);
      } else {
        return true;
      }
    });
  }
}
