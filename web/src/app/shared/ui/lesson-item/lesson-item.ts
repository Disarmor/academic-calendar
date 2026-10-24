import { Component, computed, input } from '@angular/core';
import { formatTime, parseTime } from '../../../core/time/local-date';
import { Lesson, LessonStatus } from '../../../models/schedule';
import { LESSON_KIND_LABELS } from '../../labels';

@Component({
  selector: 'app-lesson-item',
  templateUrl: './lesson-item.html',
  styleUrl: './lesson-item.scss',
  host: {
    '[class.current]': "status() === 'current'",
    '[class.past]': "status() === 'past'",
  },
})
export class LessonItem {
  readonly lesson = input.required<Lesson>();
  readonly durationMinutes = input.required<number>();
  readonly status = input<LessonStatus>();

  protected readonly end = computed(() => formatTime(parseTime(this.lesson().start) + this.durationMinutes()));
  protected readonly kindLabels = LESSON_KIND_LABELS;
}
