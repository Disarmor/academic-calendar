import { Component, inject } from '@angular/core';
import { CalendarState } from '../../core/calendar/calendar-state';
import { AcademicData } from '../../core/data/academic-data';
import { ScheduleState } from '../../core/schedule/schedule-state';
import { TodayLessons } from './today-lessons/today-lessons';
import { WeekSchedule } from './week-schedule/week-schedule';
import { WeekTypeCard } from './week-type-card/week-type-card';

@Component({
  selector: 'app-dashboard',
  imports: [WeekTypeCard, TodayLessons, WeekSchedule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly data = inject(AcademicData);
  protected readonly calendar = inject(CalendarState);
  protected readonly scheduleState = inject(ScheduleState);
}
