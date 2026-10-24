import {
  CalendarEvent,
  CalendarEventType,
  LocalDate,
  Semester,
  WeekParityConfig,
  WeekType,
} from '../../models/academic-calendar';
import { daysBetween, startOfWeek } from '../time/local-date';

/** События, в дни которых обычных занятий нет. */
const NO_CLASSES_EVENT_TYPES: ReadonlySet<CalendarEventType> = new Set(['vacation', 'holiday', 'exams']);

/** События, которые не касаются студентов напрямую и не попадают в список ближайших. */
const HIDDEN_UPCOMING_EVENT_TYPES: ReadonlySet<CalendarEventType> = new Set(['council']);

export interface UpcomingEvent {
  readonly event: CalendarEvent;
  readonly daysUntil: number;
}

function oppositeWeekType(weekType: WeekType): WeekType {
  return weekType === 'numerator' ? 'denominator' : 'numerator';
}

/**
 * Тип недели, в которую попадает дата. Недели чередуются непрерывно
 * от опорной недели, ручные исправления имеют приоритет.
 */
export function getWeekType(date: LocalDate, parity: WeekParityConfig): WeekType {
  const weekStart = startOfWeek(date);
  const override = parity.overrides.find((item) => item.weekStart === weekStart);
  if (override) {
    return override.weekType;
  }
  const weeksFromAnchor = daysBetween(startOfWeek(parity.anchorWeekStart), weekStart) / 7;
  return weeksFromAnchor % 2 === 0 ? parity.anchorWeekType : oppositeWeekType(parity.anchorWeekType);
}

export function isEventActive(event: CalendarEvent, date: LocalDate): boolean {
  return event.start <= date && date <= event.end;
}

export function activeEvents(events: readonly CalendarEvent[], date: LocalDate): CalendarEvent[] {
  return events.filter((event) => isEventActive(event, date));
}

/** Событие, из-за которого в этот день нет занятий (каникулы, праздник, сессия). */
export function findNoClassesReason(
  events: readonly CalendarEvent[],
  date: LocalDate,
): CalendarEvent | undefined {
  return events.find((event) => NO_CLASSES_EVENT_TYPES.has(event.type) && isEventActive(event, date));
}

/** Ближайшие ещё не начавшиеся события, по дате начала. Идущие сейчас показываются отдельно. */
export function upcomingEvents(events: readonly CalendarEvent[], today: LocalDate, limit: number): UpcomingEvent[] {
  return events
    .filter((event) => event.start > today && !HIDDEN_UPCOMING_EVENT_TYPES.has(event.type))
    .sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end))
    .slice(0, limit)
    .map((event) => ({ event, daysUntil: daysBetween(today, event.start) }));
}

export function findSemester(semesters: readonly Semester[], date: LocalDate): Semester | undefined {
  return semesters.find((semester) => semester.start <= date && date <= semester.end);
}
