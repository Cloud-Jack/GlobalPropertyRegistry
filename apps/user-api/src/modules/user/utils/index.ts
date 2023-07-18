import { parse } from 'date-fns';

import { DATE_FORMAT } from '../validators/isBirthOfDayFormat';

export function parseDateInput(dateString: string) {
  return parse(dateString, DATE_FORMAT, new Date());
}
