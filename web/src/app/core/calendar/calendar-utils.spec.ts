import { CalendarEvent, Semester, WeekParityConfig } from '../../models/academic-calendar';
import { activeEvents, findNoClassesReason, findSemester, getWeekType, upcomingEvents } from './calendar-utils';

const parity: WeekParityConfig = {
  anchorWeekStart: '2026-09-07',
  anchorWeekType: 'denominator',
  overrides: [],
};

describe('getWeekType', () => {
  it('совпадает с академическим календарём 2026/27', () => {
    expect(getWeekType('2026-09-07', parity)).toBe('denominator');
    expect(getWeekType('2026-09-13', parity)).toBe('denominator');
    expect(getWeekType('2026-09-14', parity)).toBe('numerator');
    expect(getWeekType('2026-10-24', parity)).toBe('denominator');
    // Весенний семестр: строка «Январь-Февраль» начинается с недели знаменателя.
    expect(getWeekType('2027-01-25', parity)).toBe('denominator');
    expect(getWeekType('2027-02-01', parity)).toBe('numerator');
  });

  it('работает для дат до опорной недели', () => {
    expect(getWeekType('2026-09-06', parity)).toBe('numerator');
    expect(getWeekType('2026-08-31', parity)).toBe('numerator');
    expect(getWeekType('2026-08-24', parity)).toBe('denominator');
  });

  it('учитывает ручные исправления', () => {
    const withOverride: WeekParityConfig = {
      ...parity,
      overrides: [{ weekStart: '2026-10-19', weekType: 'numerator' }],
    };
    expect(getWeekType('2026-10-22', withOverride)).toBe('numerator');
    expect(getWeekType('2026-10-26', withOverride)).toBe('numerator');
  });
});

describe('события календаря', () => {
  const events: CalendarEvent[] = [
    { title: 'Исследовательская практика 1', type: 'practice', start: '2026-10-19', end: '2026-12-25' },
    { title: 'Текущий контроль', type: 'control', start: '2026-11-02', end: '2026-11-06' },
    { title: 'Новогодние каникулы', type: 'vacation', start: '2027-01-01', end: '2027-01-10' },
  ];

  it('находит события, активные в дату (границы включительно)', () => {
    expect(activeEvents(events, '2026-11-06').map((event) => event.title)).toEqual([
      'Исследовательская практика 1',
      'Текущий контроль',
    ]);
    expect(activeEvents(events, '2026-11-07').map((event) => event.title)).toEqual(['Исследовательская практика 1']);
  });

  it('определяет дни без занятий', () => {
    expect(findNoClassesReason(events, '2027-01-05')?.title).toBe('Новогодние каникулы');
    expect(findNoClassesReason(events, '2026-11-03')).toBeUndefined();
  });

  it('отбирает ближайшие ещё не начавшиеся события без Учёного совета', () => {
    const withCouncil: CalendarEvent[] = [
      ...events,
      { title: 'Учёный совет КГТУ', type: 'council', start: '2026-10-28', end: '2026-10-28' },
    ];
    expect(upcomingEvents(withCouncil, '2026-10-24', 5)).toEqual([
      { event: events[1], daysUntil: 9 },
      { event: events[2], daysUntil: 69 },
    ]);
    expect(upcomingEvents(withCouncil, '2026-10-24', 1)).toHaveLength(1);
  });
});

describe('findSemester', () => {
  const semesters: Semester[] = [
    { title: 'Осенний семестр', number: 1, start: '2026-09-07', end: '2027-01-24' },
    { title: 'Весенний семестр', number: 2, start: '2027-01-25', end: '2027-06-13' },
  ];

  it('находит семестр по дате', () => {
    expect(findSemester(semesters, '2027-01-24')?.number).toBe(1);
    expect(findSemester(semesters, '2027-01-25')?.number).toBe(2);
    expect(findSemester(semesters, '2027-07-01')).toBeUndefined();
  });
});
