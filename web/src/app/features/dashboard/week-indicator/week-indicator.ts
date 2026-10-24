import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { CalendarEvent, LocalDate, WeekType } from '../../../models/academic-calendar';
import { WEEK_TYPE_LABELS } from '../../../shared/labels';

@Component({
  selector: 'app-week-indicator',
  imports: [DatePipe],
  templateUrl: './week-indicator.html',
  styleUrl: './week-indicator.scss',
})
export class WeekIndicator {
  readonly weekType = input.required<WeekType>();
  readonly weekStart = input.required<LocalDate>();
  readonly weekEnd = input.required<LocalDate>();
  readonly events = input.required<readonly CalendarEvent[]>();

  protected readonly weekTypes: readonly WeekType[] = ['numerator', 'denominator'];
  protected readonly labels = WEEK_TYPE_LABELS;
}
