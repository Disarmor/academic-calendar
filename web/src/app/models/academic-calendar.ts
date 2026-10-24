/** Календарная дата без времени в формате YYYY-MM-DD. */
export type LocalDate = string;

export type WeekType = 'numerator' | 'denominator';

export type CalendarEventType =
  | 'semester'
  | 'registration'
  | 'practice'
  | 'control'
  | 'exams'
  | 'retake'
  | 'vacation'
  | 'holiday'
  | 'council';

export interface CalendarEvent {
  readonly title: string;
  readonly type: CalendarEventType;
  readonly start: LocalDate;
  /** Включительно. */
  readonly end: LocalDate;
}

export interface WeekTypeOverride {
  /** Понедельник недели, для которой тип задан вручную. */
  readonly weekStart: LocalDate;
  readonly weekType: WeekType;
}

export interface WeekParityConfig {
  /** Понедельник недели с известным типом, от неё ведётся отсчёт. */
  readonly anchorWeekStart: LocalDate;
  readonly anchorWeekType: WeekType;
  readonly overrides: readonly WeekTypeOverride[];
}

export interface Semester {
  readonly title: string;
  /** Номер семестра обучения группы; у летнего семестра номера нет. */
  readonly number?: number;
  readonly start: LocalDate;
  readonly end: LocalDate;
}

export interface AcademicCalendar {
  readonly academicYear: string;
  readonly weekParity: WeekParityConfig;
  readonly semesters: readonly Semester[];
  readonly events: readonly CalendarEvent[];
}
