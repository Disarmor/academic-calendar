import announcementsJson from '../../../../public/data/announcements.json';
import calendarJson from '../../../../public/data/calendar.json';
import scheduleJson from '../../../../public/data/schedule.json';
import { AcademicCalendar } from '../../models/academic-calendar';
import { AnnouncementsFile } from '../../models/announcement';
import { Schedule, SubjectColor } from '../../models/schedule';
import { isSafeUrl } from '../browser/safe-url';

/** Проверка JSON-файлов: ошибка в данных должна ловиться тестами, а не на сайте. */
const calendar = calendarJson as AcademicCalendar;
const schedule = scheduleJson as Schedule;
const announcements = announcementsJson as AnnouncementsFile;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const SUBJECT_COLORS: readonly SubjectColor[] = ['cyan', 'amber', 'violet', 'rose', 'teal', 'indigo', 'lime', 'slate'];

function isValidDate(value: string): boolean {
  return DATE_PATTERN.test(value) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);
}

function expectValidRange(range: { start: string; end: string }, name: string): void {
  expect(isValidDate(range.start), name).toBe(true);
  expect(isValidDate(range.end), name).toBe(true);
  expect(range.start <= range.end, name).toBe(true);
}

describe('public/data', () => {
  it('calendar.json: корректные даты событий и семестров', () => {
    expect(isValidDate(calendar.weekParity.anchorWeekStart)).toBe(true);
    for (const event of calendar.events) {
      expectValidRange(event, event.title);
    }
    for (const semester of calendar.semesters) {
      expectValidRange(semester, semester.title);
    }
  });

  it('schedule.json: корректные дни, время, тип недели и ссылки', () => {
    expect(isValidDate(schedule.validFrom) && isValidDate(schedule.validTo)).toBe(true);
    expect(schedule.lessonDurationMinutes).toBeGreaterThan(0);
    for (const lesson of schedule.lessons) {
      expect(lesson.weekday >= 1 && lesson.weekday <= 7, lesson.subject).toBe(true);
      expect(TIME_PATTERN.test(lesson.start), lesson.subject).toBe(true);
      expect(['numerator', 'denominator', 'both']).toContain(lesson.week);
      expect(['lecture', 'practice', 'lab']).toContain(lesson.kind);
      if (lesson.link !== undefined) {
        expect(isSafeUrl(lesson.link), lesson.subject).toBe(true);
      }
    }
  });

  it('schedule.json: у каждого предмета есть цвет из палитры', () => {
    const subjectNames = new Set(schedule.subjects.map((subject) => subject.name));
    for (const subject of schedule.subjects) {
      expect(SUBJECT_COLORS, subject.name).toContain(subject.color);
    }
    for (const lesson of schedule.lessons) {
      expect(subjectNames.has(lesson.subject), lesson.subject).toBe(true);
    }
  });

  it('announcements.json: обязательные поля и корректные даты', () => {
    for (const item of announcements.announcements) {
      expect(item.title.trim().length, 'title').toBeGreaterThan(0);
      expect(item.text.trim().length, item.title).toBeGreaterThan(0);
      expect(isValidDate(item.date), item.title).toBe(true);
      if (item.expires !== undefined) {
        expect(isValidDate(item.expires) && item.date <= item.expires, item.title).toBe(true);
      }
    }
  });
});
