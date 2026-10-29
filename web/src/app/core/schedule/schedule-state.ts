import { computed, inject, Service } from '@angular/core';
import { CalendarState } from '../calendar/calendar-state';
import { AcademicData } from '../data/academic-data';
import { Clock } from '../time/clock';
import { buildTodayPlan, subjectMap, TodayPlan } from './schedule-utils';

/** Расписание группы и план занятий на сегодня. */
@Service()
export class ScheduleState {
  private readonly clock = inject(Clock);
  private readonly calendarState = inject(CalendarState);
  private readonly resource = inject(AcademicData).schedule;

  readonly schedule = computed(() => (this.resource.hasValue() ? this.resource.value() : undefined));

  readonly subjects = computed(() => {
    const schedule = this.schedule();
    return schedule ? subjectMap(schedule) : {};
  });

  readonly todayPlan = computed<TodayPlan | undefined>(() => {
    const schedule = this.schedule();
    const weekType = this.calendarState.weekType();
    if (!schedule || !weekType) {
      return undefined;
    }
    return buildTodayPlan(schedule, this.clock.now(), weekType, this.calendarState.noClassesReason());
  });
}
