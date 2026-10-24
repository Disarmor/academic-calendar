import { Component, computed, input, linkedSignal } from '@angular/core';
import { weekScheduleDays } from '../../../core/schedule/schedule-utils';
import { WeekType } from '../../../models/academic-calendar';
import { Schedule, Weekday } from '../../../models/schedule';
import { WEEK_TYPE_LABELS, WEEKDAY_LABELS } from '../../../shared/labels';
import { LessonItem } from '../../../shared/ui/lesson-item/lesson-item';

@Component({
  selector: 'app-week-schedule',
  imports: [LessonItem],
  templateUrl: './week-schedule.html',
  styleUrl: './week-schedule.scss',
})
export class WeekSchedule {
  readonly schedule = input.required<Schedule>();
  readonly currentWeekType = input.required<WeekType>();
  readonly todayWeekday = input.required<Weekday>();

  /** Неделя, которую смотрит пользователь; по умолчанию текущая. */
  protected readonly selectedWeekType = linkedSignal(() => this.currentWeekType());
  protected readonly isCurrentWeekSelected = computed(() => this.selectedWeekType() === this.currentWeekType());
  protected readonly days = computed(() => weekScheduleDays(this.schedule(), this.selectedWeekType()));

  protected readonly weekTypes: readonly WeekType[] = ['numerator', 'denominator'];
  protected readonly weekTypeLabels = WEEK_TYPE_LABELS;
  protected readonly weekdayLabels = WEEKDAY_LABELS;
}
