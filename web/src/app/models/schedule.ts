import { LocalDate, WeekType } from './academic-calendar';

/** День недели по ISO: 1 — понедельник, 7 — воскресенье. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type LessonKind = 'lecture' | 'practice' | 'lab';

/** Неделя, по которой проходит занятие: числитель, знаменатель или каждая. */
export type LessonWeek = WeekType | 'both';

export interface Lesson {
  readonly weekday: Weekday;
  /** Время начала, HH:MM. */
  readonly start: string;
  readonly week: LessonWeek;
  readonly kind: LessonKind;
  readonly subject: string;
  readonly teacher: string;
  readonly room: string;
}

export interface Schedule {
  readonly title: string;
  readonly validFrom: LocalDate;
  readonly validTo: LocalDate;
  readonly lessonDurationMinutes: number;
  readonly lessons: readonly Lesson[];
}

export type LessonStatus = 'past' | 'current' | 'upcoming';
