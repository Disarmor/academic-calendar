import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DraftItem } from '../../../core/announcements/announcements-editor';
import {
  ANNOUNCEMENT_TEXT_MAX,
  ANNOUNCEMENT_TITLE_MAX,
  announcementErrors,
} from '../../../core/announcements/announcements-utils';
import { LocalDate } from '../../../models/academic-calendar';
import { Announcement } from '../../../models/announcement';

export interface AnnouncementSave {
  readonly announcement: Announcement;
  /** Ключ редактируемой записи; нет — новое объявление. */
  readonly key?: number;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-announcement-form',
  styleUrl: './announcement-form.scss',
  templateUrl: './announcement-form.html',
})
export class AnnouncementForm {
  /** Объявление, которое редактируется; `null` — создаётся новое. */
  readonly editing = input<DraftItem | null>(null);
  /** Дата публикации по умолчанию — сегодня. */
  readonly defaultDate = input.required<LocalDate>();
  readonly saved = output<AnnouncementSave>();
  readonly cancelled = output();

  protected readonly titleMax = ANNOUNCEMENT_TITLE_MAX;
  protected readonly textMax = ANNOUNCEMENT_TEXT_MAX;
  protected readonly errors = signal<string[]>([]);

  protected readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    text: new FormControl('', { nonNullable: true }),
    date: new FormControl('', { nonNullable: true }),
    pinned: new FormControl(false, { nonNullable: true }),
    expires: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    // Форма заполняется заново, когда выбирают другое объявление или нажимают «Новое».
    effect(() => {
      const item = this.editing()?.announcement;
      const date = untracked(this.defaultDate);
      this.form.reset({
        title: item?.title ?? '',
        text: item?.text ?? '',
        date: item?.date ?? date,
        pinned: item?.pinned ?? false,
        expires: item?.expires ?? '',
      });
      this.errors.set([]);
    });
  }

  protected submit(): void {
    const value = this.form.getRawValue();
    const announcement: Announcement = {
      title: value.title,
      text: value.text,
      date: value.date,
      pinned: value.pinned,
      expires: value.expires || undefined,
    };
    const errors = announcementErrors(announcement);
    this.errors.set(errors);
    if (errors.length > 0) {
      return;
    }
    this.saved.emit({ announcement, key: this.editing()?.key });
    this.form.reset({ title: '', text: '', date: this.defaultDate(), pinned: false, expires: '' });
  }
}
