import { computed, inject, Service } from '@angular/core';
import { AcademicData } from '../data/academic-data';
import { Clock } from '../time/clock';
import { addDays, isoWeekday, startOfWeek } from '../time/local-date';
import { activeEvents, findNoClassesReason, getWeekType } from './calendar-utils';

/** Текущая неделя и события академического календаря на сегодня. */
@Service()
export class CalendarState {
  private readonly clock = inject(Clock);
  private readonly resource = inject(AcademicData).calendar;

  private readonly calendar = computed(() => (this.resource.hasValue() ? this.resource.value() : undefined));
  private readonly events = computed(() => this.calendar()?.events ?? []);

  readonly todayWeekday = computed(() => isoWeekday(this.clock.today()));
  readonly weekStart = computed(() => startOfWeek(this.clock.today()));
  readonly weekEnd = computed(() => addDays(this.weekStart(), 6));

  readonly weekType = computed(() => {
    const calendar = this.calendar();
    return calendar ? getWeekType(this.clock.today(), calendar.weekParity) : undefined;
  });

  readonly todayEvents = computed(() => activeEvents(this.events(), this.clock.today()));
  readonly noClassesReason = computed(() => findNoClassesReason(this.events(), this.clock.today()));
}
