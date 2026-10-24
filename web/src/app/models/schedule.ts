import { LocalDate, WeekType } from './academic-calendar';

/** День недели по ISO: 1 — понедельник, 7 — воскресенье. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type LessonKind = 'lecture' | 'practice' | 'lab';

/** Неделя, по которой проходит занятие: числитель, знаменатель или каждая. */
export type LessonWeek = WeekType | 'both';

/** Цветовая метка предмета; значения соответствуют токенам `--subject-*` в styles.scss. */
export type SubjectColor = 'cyan' | 'amber' | 'violet' | 'rose' | 'teal' | 'indigo' | 'lime' | 'slate';

export interface Subject {
  readonly name: string;
  readonly color: SubjectColor;
}

export interface Lesson {
  readonly weekday: Weekday;
  /** Время начала, HH:MM. */
  readonly start: string;
  readonly week: LessonWeek;
  readonly kind: LessonKind;
  /** Должен совпадать с `Subject.name`. */
  readonly subject: string;
  readonly teacher: string;
  readonly room: string;
  /** Ссылка на онлайн-занятие, только https. */
  readonly link?: string;
}

export interface Schedule {
  readonly title: string;
  readonly validFrom: LocalDate;
  readonly validTo: LocalDate;
  readonly lessonDurationMinutes: number;
  readonly subjects: readonly Subject[];
  readonly lessons: readonly Lesson[];
}

export type LessonStatus = 'past' | 'current' | 'upcoming';
