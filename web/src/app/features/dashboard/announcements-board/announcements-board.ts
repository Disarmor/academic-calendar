import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Announcement } from '../../../models/announcement';

@Component({
  selector: 'app-announcements-board',
  imports: [DatePipe],
  templateUrl: './announcements-board.html',
  styleUrl: './announcements-board.scss',
})
export class AnnouncementsBoard {
  readonly announcements = input.required<readonly Announcement[]>();
  readonly hasError = input.required<boolean>();
}
