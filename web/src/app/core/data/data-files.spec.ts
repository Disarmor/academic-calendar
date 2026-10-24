import calendarJson from '../../../../public/data/calendar.json';
import scheduleJson from '../../../../public/data/schedule.json';
import { AcademicCalendar } from '../../models/academic-calendar';
import { Schedule } from '../../models/schedule';

/** Проверка JSON-файлов: ошибка в данных должна ловиться тестами, а не на сайте. */
const calendar = calendarJson as AcademicCalendar;
const schedule = scheduleJson as Schedule;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidDate(value: string): boolean {
  return DATE_PATTERN.test(value) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);
}

describe('public/data', () => {
  it('calendar.json: корректные даты, начало не позже конца', () => {
    expect(isValidDate(calendar.weekParity.anchorWeekStart)).toBe(true);
    for (const event of calendar.events) {
      expect(isValidDate(event.start), event.title).toBe(true);
      expect(isValidDate(event.end), event.title).toBe(true);
      expect(event.start <= event.end, event.title).toBe(true);
    }
  });

  it('schedule.json: корректные дни, время и тип недели', () => {
    expect(isValidDate(schedule.validFrom) && isValidDate(schedule.validTo)).toBe(true);
    expect(schedule.lessonDurationMinutes).toBeGreaterThan(0);
    for (const lesson of schedule.lessons) {
      expect(lesson.weekday >= 1 && lesson.weekday <= 7, lesson.subject).toBe(true);
      expect(TIME_PATTERN.test(lesson.start), lesson.subject).toBe(true);
      expect(['numerator', 'denominator', 'both']).toContain(lesson.week);
      expect(['lecture', 'practice', 'lab']).toContain(lesson.kind);
    }
  });
});
