import { CalendarEvent } from '../../models/academic-calendar';
import { Lesson, Schedule } from '../../models/schedule';
import { buildTodayPlan, lessonStatus, lessonsForWeekday, weekScheduleDays } from './schedule-utils';

const lesson = (overrides: Partial<Lesson>): Lesson => ({
  weekday: 1,
  start: '16:30',
  week: 'both',
  kind: 'lecture',
  subject: 'Предмет',
  teacher: 'Преподаватель',
  room: '1/100',
  ...overrides,
});

const schedule: Schedule = {
  title: 'Тест',
  validFrom: '2026-09-15',
  validTo: '2026-12-31',
  lessonDurationMinutes: 80,
  lessons: [
    lesson({ weekday: 1, start: '18:00', week: 'numerator', subject: 'Числитель' }),
    lesson({ weekday: 1, start: '16:30', subject: 'Каждую неделю' }),
    lesson({ weekday: 2, start: '16:30', week: 'denominator', subject: 'Знаменатель' }),
  ],
};

describe('schedule-utils', () => {
  it('отбирает пары дня по типу недели и сортирует по времени', () => {
    expect(lessonsForWeekday(schedule, 1, 'numerator').map((item) => item.subject)).toEqual([
      'Каждую неделю',
      'Числитель',
    ]);
    expect(lessonsForWeekday(schedule, 1, 'denominator').map((item) => item.subject)).toEqual(['Каждую неделю']);
  });

  it('собирает неделю без пустых дней', () => {
    expect(weekScheduleDays(schedule, 'numerator').map((day) => day.weekday)).toEqual([1]);
    expect(weekScheduleDays(schedule, 'denominator').map((day) => day.weekday)).toEqual([1, 2]);
  });

  it('определяет статус пары', () => {
    const item = lesson({ start: '16:30' });
    expect(lessonStatus(item, 989, 80)).toBe('upcoming');
    expect(lessonStatus(item, 990, 80)).toBe('current');
    expect(lessonStatus(item, 1069, 80)).toBe('current');
    expect(lessonStatus(item, 1070, 80)).toBe('past');
  });

  describe('buildTodayPlan', () => {
    // 2026-10-19 — понедельник.
    const monday = { date: '2026-10-19', minutes: 17 * 60 };

    it('возвращает пары со статусами', () => {
      const plan = buildTodayPlan(schedule, monday, 'numerator', undefined);
      expect(plan.kind).toBe('lessons');
      if (plan.kind === 'lessons') {
        expect(plan.agenda.map((item) => item.status)).toEqual(['current', 'upcoming']);
      }
    });

    it('сообщает о каникулах раньше всего остального', () => {
      const vacation: CalendarEvent = { title: 'Каникулы', type: 'vacation', start: '2026-10-19', end: '2026-10-19' };
      expect(buildTodayPlan(schedule, monday, 'numerator', vacation)).toEqual({ kind: 'no-classes', reason: vacation });
    });

    it('различает день вне периода расписания и свободный день', () => {
      expect(buildTodayPlan(schedule, { date: '2027-02-08', minutes: 0 }, 'denominator', undefined).kind).toBe(
        'out-of-schedule',
      );
      expect(buildTodayPlan(schedule, { date: '2026-10-21', minutes: 0 }, 'denominator', undefined).kind).toBe(
        'free-day',
      );
    });
  });
});
