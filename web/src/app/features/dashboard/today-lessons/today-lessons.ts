import { Component, input } from '@angular/core';
import { TodayPlan } from '../../../core/schedule/schedule-utils';
import { SubjectColor } from '../../../models/schedule';
import { LessonItem } from '../../../shared/ui/lesson-item/lesson-item';

@Component({
  selector: 'app-today-lessons',
  imports: [LessonItem],
  templateUrl: './today-lessons.html',
  styleUrl: './today-lessons.scss',
})
export class TodayLessons {
  readonly plan = input.required<TodayPlan>();
  readonly durationMinutes = input.required<number>();
  readonly subjectColors = input.required<Readonly<Record<string, SubjectColor>>>();
}
