import { LocalDate } from '../../models/academic-calendar';
import { Weekday } from '../../models/schedule';

/** Все даты приложения считаются по времени Бишкека, а не по часам браузера. */
export const APP_TIME_ZONE = 'Asia/Bishkek';

const MS_PER_DAY = 86_400_000;

const zonedFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export interface ZonedDateTime {
  readonly date: LocalDate;
  /** Минуты от полуночи. */
  readonly minutes: number;
}

export function toZonedDateTime(instant: Date): ZonedDateTime {
  const parts: Record<string, string> = {};
  for (const { type, value } of zonedFormatter.formatToParts(instant)) {
    parts[type] = value;
  }
  return {
    date: `${parts['year']}-${parts['month']}-${parts['day']}`,
    minutes: Number(parts['hour']) * 60 + Number(parts['minute']),
  };
}

function toUtcMs(date: LocalDate): number {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function fromUtcMs(ms: number): LocalDate {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(date: LocalDate, days: number): LocalDate {
  return fromUtcMs(toUtcMs(date) + days * MS_PER_DAY);
}

/** Количество дней от `from` до `to` (отрицательное, если `to` раньше). */
export function daysBetween(from: LocalDate, to: LocalDate): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / MS_PER_DAY);
}

export function isoWeekday(date: LocalDate): Weekday {
  const day = new Date(toUtcMs(date)).getUTCDay();
  return (day === 0 ? 7 : day) as Weekday;
}

export function startOfWeek(date: LocalDate): LocalDate {
  return addDays(date, 1 - isoWeekday(date));
}

/** 'HH:MM' → минуты от полуночи. */
export function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** Минуты от полуночи → 'HH:MM'. */
export function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
