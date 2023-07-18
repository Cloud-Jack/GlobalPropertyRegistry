import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isValid } from 'date-fns';
import { ApiException } from 'libs/utils';

export const DATE_FORMAT = 'dd-MM-yyyy';

@ValidatorConstraint({ name: 'isBirthOfDayFormat', async: true })
@Injectable()
export class IsBirthOfDayFormat implements ValidatorConstraintInterface {
  async validate(value: Date): Promise<boolean> {
    if (!isValid(value))
      throw new ApiException(`invalid date format, must be ${DATE_FORMAT}`, HttpStatus.PRECONDITION_FAILED);

    if (Number(value) > Date.now()) throw new ApiException(`invalid date`, HttpStatus.PRECONDITION_FAILED);
    return true;
  }

  defaultMessage(): string {
    return `invalid date format, must be ${DATE_FORMAT}`;
  }
}
