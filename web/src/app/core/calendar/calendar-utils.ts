import {
  CalendarEvent,
  CalendarEventType,
  LocalDate,
  WeekParityConfig,
  WeekType,
} from '../../models/academic-calendar';
import { daysBetween, startOfWeek } from '../time/local-date';

/** События, в дни которых обычных занятий нет. */
const NO_CLASSES_EVENT_TYPES: ReadonlySet<CalendarEventType> = new Set(['vacation', 'holiday', 'exams']);

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
