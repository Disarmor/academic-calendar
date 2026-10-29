import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { isLongAnnouncement } from '../../../core/announcements/announcements-utils';
import { Announcement } from '../../../models/announcement';

/** Заметка-стикер с одним объявлением старосты. */
@Component({
  imports: [DatePipe],
  selector: 'app-announcement-note',
  styleUrl: './announcement-note.scss',
  templateUrl: './announcement-note.html',
  host: {
    '[class.pinned]': 'note().pinned && !archived()',
    '[class.archived]': 'archived()',
  },
})
export class AnnouncementNote {
  readonly note = input.required<Announcement>();
  /** Истёкшее объявление показывается приглушённым. */
  readonly archived = input(false);
  /** Сокращать длинный текст и показывать кнопку «Показать полностью». */
  readonly preview = input(false);
  readonly expand = output();

  protected readonly clamped = computed(() => this.preview() && isLongAnnouncement(this.note().text));
}
