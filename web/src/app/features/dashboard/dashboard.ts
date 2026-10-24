import { Component, inject } from '@angular/core';
import { AnnouncementsState } from '../../core/announcements/announcements-state';
import { CalendarState } from '../../core/calendar/calendar-state';
import { AcademicData } from '../../core/data/academic-data';
import { ScheduleState } from '../../core/schedule/schedule-state';
import { AnnouncementsBoard } from './announcements-board/announcements-board';
import { PageHeader } from './page-header/page-header';
import { TodayLessons } from './today-lessons/today-lessons';
import { UpcomingEvents } from './upcoming-events/upcoming-events';
import { WeekIndicator } from './week-indicator/week-indicator';
import { WeekSchedule } from './week-schedule/week-schedule';

@Component({
  selector: 'app-dashboard',
  imports: [PageHeader, WeekIndicator, TodayLessons, WeekSchedule, AnnouncementsBoard, UpcomingEvents],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly data = inject(AcademicData);
  protected readonly calendar = inject(CalendarState);
  protected readonly scheduleState = inject(ScheduleState);
  protected readonly announcementsState = inject(AnnouncementsState);
}
