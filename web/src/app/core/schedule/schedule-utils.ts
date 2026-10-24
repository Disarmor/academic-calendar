import { CalendarEvent, LocalDate, WeekType } from '../../models/academic-calendar';
import { Lesson, LessonStatus, Schedule, SubjectColor, Weekday } from '../../models/schedule';
import { isoWeekday, parseTime, ZonedDateTime } from '../time/local-date';

export interface ScheduleDay {
  readonly weekday: Weekday;
  readonly lessons: readonly Lesson[];
}

export interface AgendaItem {
  readonly lesson: Lesson;
  readonly status: LessonStatus;
}

/** Что показать в блоке «Сегодня». */
export type TodayPlan =
  | { readonly kind: 'lessons'; readonly agenda: readonly AgendaItem[] }
  | { readonly kind: 'no-classes'; readonly reason: CalendarEvent }
  | { readonly kind: 'out-of-schedule' }
  | { readonly kind: 'free-day' };

const STUDY_DAYS: readonly Weekday[] = [1, 2, 3, 4, 5, 6];

function byStartTime(a: Lesson, b: Lesson): number {
  return parseTime(a.start) - parseTime(b.start);
}

/** Название предмета → цветовая метка. */
export function subjectColorMap(schedule: Schedule): Readonly<Record<string, SubjectColor>> {
  return Object.fromEntries(schedule.subjects.map((subject) => [subject.name, subject.color]));
}

export function isScheduleActive(schedule: Schedule, date: LocalDate): boolean {
  return schedule.validFrom <= date && date <= schedule.validTo;
}

export function lessonsForWeekday(schedule: Schedule, weekday: Weekday, weekType: WeekType): Lesson[] {
  return schedule.lessons
    .filter((lesson) => lesson.weekday === weekday && (lesson.week === 'both' || lesson.week === weekType))
    .sort(byStartTime);
}

/** Учебные дни недели с занятиями; дни без пар не включаются. */
export function weekScheduleDays(schedule: Schedule, weekType: WeekType): ScheduleDay[] {
  return STUDY_DAYS.map((weekday) => ({ weekday, lessons: lessonsForWeekday(schedule, weekday, weekType) })).filter(
    (day) => day.lessons.length > 0,
  );
}

export function lessonStatus(lesson: Lesson, nowMinutes: number, durationMinutes: number): LessonStatus {
  const start = parseTime(lesson.start);
  if (nowMinutes < start) {
    return 'upcoming';
  }
  return nowMinutes < start + durationMinutes ? 'current' : 'past';
}

export function buildTodayPlan(
  schedule: Schedule,
  now: ZonedDateTime,
  weekType: WeekType,
  noClassesReason: CalendarEvent | undefined,
): TodayPlan {
  if (noClassesReason) {
    return { kind: 'no-classes', reason: noClassesReason };
  }
  if (!isScheduleActive(schedule, now.date)) {
    return { kind: 'out-of-schedule' };
  }
  const lessons = lessonsForWeekday(schedule, isoWeekday(now.date), weekType);
  if (lessons.length === 0) {
    return { kind: 'free-day' };
  }
  return {
    kind: 'lessons',
    agenda: lessons.map((lesson) => ({
      lesson,
      status: lessonStatus(lesson, now.minutes, schedule.lessonDurationMinutes),
    })),
  };
}
