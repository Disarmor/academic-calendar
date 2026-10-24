import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { UpcomingEvent } from '../../../core/calendar/calendar-utils';
import { DaysUntilPipe } from '../../../shared/pipes/days-until-pipe';

@Component({
  selector: 'app-upcoming-events',
  imports: [DatePipe, DaysUntilPipe],
  templateUrl: './upcoming-events.html',
  styleUrl: './upcoming-events.scss',
})
export class UpcomingEvents {
  readonly items = input.required<readonly UpcomingEvent[]>();
}
