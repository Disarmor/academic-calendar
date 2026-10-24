import { Pipe, PipeTransform } from '@angular/core';

const DAY_FORMS = ['день', 'дня', 'дней'] as const;

function pluralDays(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) {
    return DAY_FORMS[2];
  }
  if (mod10 === 1) {
    return DAY_FORMS[0];
  }
  return mod10 >= 2 && mod10 <= 4 ? DAY_FORMS[1] : DAY_FORMS[2];
}

/** Количество дней до события → «сегодня», «завтра», «через 5 дней». */
@Pipe({ name: 'daysUntil' })
export class DaysUntilPipe implements PipeTransform {
  transform(days: number): string {
    if (days <= 0) {
      return 'сегодня';
    }
    if (days === 1) {
      return 'завтра';
    }
    return `через ${days} ${pluralDays(days)}`;
  }
}
