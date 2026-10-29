import { Component, computed, input } from '@angular/core';
import { isSafeUrl } from '../../../core/browser/safe-url';
import { formatTime, parseTime } from '../../../core/time/local-date';
import { RouterLink } from '@angular/router';
import { Lesson, LessonStatus, Subject } from '../../../models/schedule';
import { LESSON_KIND_LABELS } from '../../labels';
import { CopyButton } from '../copy-button/copy-button';

@Component({
  selector: 'app-lesson-item',
  imports: [CopyButton, RouterLink],
  templateUrl: './lesson-item.html',
  styleUrl: './lesson-item.scss',
  host: {
    '[class.current]': "status() === 'current'",
    '[class.past]': "status() === 'past'",
    '[style.--subject-color]': "subject() ? 'var(--subject-' + subject()?.color + ')' : null",
  },
})
export class LessonItem {
  readonly lesson = input.required<Lesson>();
  readonly durationMinutes = input.required<number>();
  readonly status = input<LessonStatus>();
  /** Предмет из расписания: цвет полосы и ссылка на материалы. */
  readonly subject = input<Subject>();

  protected readonly end = computed(() => formatTime(parseTime(this.lesson().start) + this.durationMinutes()));
  protected readonly safeLink = computed(() => {
    const link = this.lesson().link;
    return link && isSafeUrl(link) ? link : undefined;
  });
  protected readonly kindLabels = LESSON_KIND_LABELS;
}
