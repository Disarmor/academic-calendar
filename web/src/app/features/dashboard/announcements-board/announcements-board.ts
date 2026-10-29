import { Component, input, viewChild } from '@angular/core';
import { Announcement } from '../../../models/announcement';
import { AnnouncementNote } from '../announcement-note/announcement-note';
import { AnnouncementsDialog, AnnouncementsDialogTarget } from '../announcements-dialog/announcements-dialog';

@Component({
  selector: 'app-announcements-board',
  imports: [AnnouncementNote, AnnouncementsDialog],
  templateUrl: './announcements-board.html',
  styleUrl: './announcements-board.scss',
})
export class AnnouncementsBoard {
  readonly announcements = input.required<readonly Announcement[]>();
  readonly hasError = input.required<boolean>();
  /** Объявления, срок показа которых закончился. */
  readonly archive = input<readonly Announcement[]>([]);

  private readonly dialog = viewChild.required(AnnouncementsDialog);

  protected openDialog(target?: AnnouncementsDialogTarget): void {
    this.dialog().open(target);
  }
}
