import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { CalendarEvent, LocalDate, WeekType } from '../../../models/academic-calendar';
import { WEEK_TYPE_LABELS } from '../../../shared/labels';

@Component({
  selector: 'app-week-type-card',
  imports: [DatePipe],
  templateUrl: './week-type-card.html',
  styleUrl: './week-type-card.scss',
})
export class WeekTypeCard {
  readonly weekType = input.required<WeekType>();
  readonly weekStart = input.required<LocalDate>();
  readonly weekEnd = input.required<LocalDate>();
  readonly events = input.required<readonly CalendarEvent[]>();

  protected readonly labels = WEEK_TYPE_LABELS;
}
