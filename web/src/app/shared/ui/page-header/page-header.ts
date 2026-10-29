import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocalDate, Semester } from '../../../models/academic-calendar';

@Component({
  selector: 'app-page-header',
  imports: [DatePipe, NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly today = input.required<LocalDate>();
  readonly semester = input<Semester>();
  readonly announcementsCount = input.required<number>();
}
