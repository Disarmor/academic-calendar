import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { DraftItem } from '../../../core/announcements/announcements-editor';
import { AnnouncementStatus } from '../../../core/announcements/announcements-utils';

const STATUS_LABELS: Readonly<Record<AnnouncementStatus, string>> = {
  scheduled: 'Запланировано',
  active: 'Показывается',
  expired: 'В архиве',
};

@Component({
  imports: [DatePipe],
  selector: 'app-announcement-list',
  styleUrl: './announcement-list.scss',
  templateUrl: './announcement-list.html',
})
export class AnnouncementList {
  readonly items = input.required<readonly DraftItem[]>();
  /** Ключ объявления, открытого в форме. */
  readonly editingKey = input<number>();
  readonly edit = output<number>();
  readonly remove = output<number>();

  protected readonly statusLabels = STATUS_LABELS;
}
