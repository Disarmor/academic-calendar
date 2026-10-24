import { computed, inject, Service } from '@angular/core';
import { AcademicData } from '../data/academic-data';
import { Clock } from '../time/clock';
import { addDays, isoWeekday, startOfWeek } from '../time/local-date';
import { activeEvents, findNoClassesReason, findSemester, getWeekType, upcomingEvents } from './calendar-utils';

const UPCOMING_EVENTS_LIMIT = 6;

/** Текущая неделя, семестр и события академического календаря. */
@Service()
export class CalendarState {
  private readonly clock = inject(Clock);
  private readonly resource = inject(AcademicData).calendar;

  private readonly calendar = computed(() => (this.resource.hasValue() ? this.resource.value() : undefined));
  private readonly events = computed(() => this.calendar()?.events ?? []);

  readonly today = this.clock.today;
  readonly todayWeekday = computed(() => isoWeekday(this.clock.today()));
  readonly weekStart = computed(() => startOfWeek(this.clock.today()));
  readonly weekEnd = computed(() => addDays(this.weekStart(), 6));

  readonly weekType = computed(() => {
    const calendar = this.calendar();
    return calendar ? getWeekType(this.clock.today(), calendar.weekParity) : undefined;
  });

  readonly semester = computed(() => findSemester(this.calendar()?.semesters ?? [], this.clock.today()));
  readonly todayEvents = computed(() => activeEvents(this.events(), this.clock.today()));
  readonly noClassesReason = computed(() => findNoClassesReason(this.events(), this.clock.today()));
  readonly upcoming = computed(() => upcomingEvents(this.events(), this.clock.today(), UPCOMING_EVENTS_LIMIT));
}
