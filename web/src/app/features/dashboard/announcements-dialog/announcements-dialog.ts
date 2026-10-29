import { Component, ElementRef, input, viewChild, viewChildren } from '@angular/core';
import { Announcement } from '../../../models/announcement';
import { AnnouncementNote } from '../announcement-note/announcement-note';

/** Что показать сразу после открытия: объявление по номеру или архив. */
export type AnnouncementsDialogTarget = number | 'archive';

/** Модальное окно со всеми объявлениями старосты целиком и архивом. */
@Component({
  imports: [AnnouncementNote],
  selector: 'app-announcements-dialog',
  styleUrl: './announcements-dialog.scss',
  templateUrl: './announcements-dialog.html',
})
export class AnnouncementsDialog {
  readonly announcements = input.required<readonly Announcement[]>();
  readonly archive = input.required<readonly Announcement[]>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly items = viewChildren<ElementRef<HTMLElement>>('item');
  private readonly archiveTitle = viewChild<ElementRef<HTMLElement>>('archiveTitle');

  /**
   * Нативный `<dialog>` сам удерживает фокус внутри, закрывается по Esc
   * и возвращает фокус на кнопку, которой его открыли.
   */
  open(target?: AnnouncementsDialogTarget): void {
    this.dialog().nativeElement.showModal();
    const element = target === 'archive' ? this.archiveTitle() : target === undefined ? undefined : this.items()[target];
    element?.nativeElement.focus();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  /** Клик по затемнённому фону (вне окна) закрывает его. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }
}
