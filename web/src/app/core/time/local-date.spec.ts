import {
  addDays,
  daysBetween,
  formatTime,
  isoWeekday,
  isValidLocalDate,
  parseTime,
  startOfWeek,
  toZonedDateTime,
} from './local-date';

describe('local-date', () => {
  it('переводит момент времени в дату и минуты по Бишкеку (UTC+6)', () => {
    // 20:30 UTC 24 октября — это уже 02:30 25 октября в Бишкеке.
    expect(toZonedDateTime(new Date('2026-10-24T20:30:00Z'))).toEqual({ date: '2026-10-25', minutes: 150 });
    expect(toZonedDateTime(new Date('2026-10-24T10:30:00Z'))).toEqual({ date: '2026-10-24', minutes: 990 });
  });

  it('проверяет формат и существование даты', () => {
    expect(isValidLocalDate('2026-02-28')).toBe(true);
    expect(isValidLocalDate('2026-02-30')).toBe(false);
    expect(isValidLocalDate('2026-2-28')).toBe(false);
    expect(isValidLocalDate('')).toBe(false);
  });

  it('прибавляет дни через границы месяцев и годов', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2027-03-01', -1)).toBe('2027-02-28');
  });

  it('считает разницу в днях', () => {
    expect(daysBetween('2026-09-07', '2026-10-19')).toBe(42);
    expect(daysBetween('2026-10-19', '2026-09-07')).toBe(-42);
  });

  it('определяет день недели по ISO и понедельник недели', () => {
    expect(isoWeekday('2026-09-07')).toBe(1);
    expect(isoWeekday('2026-10-25')).toBe(7);
    expect(startOfWeek('2026-10-25')).toBe('2026-10-19');
    expect(startOfWeek('2026-10-19')).toBe('2026-10-19');
  });

  it('разбирает и форматирует время', () => {
    expect(parseTime('16:30')).toBe(990);
    expect(formatTime(990 + 80)).toBe('17:50');
    expect(formatTime(5)).toBe('00:05');
  });
});
