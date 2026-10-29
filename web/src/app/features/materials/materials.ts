import { Component, inject } from '@angular/core';
import { AnnouncementsState } from '../../core/announcements/announcements-state';
import { CalendarState } from '../../core/calendar/calendar-state';
import { MaterialsState } from '../../core/materials/materials-state';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { MaterialList } from './material-list/material-list';
import { SubjectMaterials } from './subject-materials/subject-materials';

@Component({
  imports: [PageHeader, SubjectMaterials, MaterialList],
  selector: 'app-materials',
  styleUrl: './materials.scss',
  templateUrl: './materials.html',
})
export class Materials {
  protected readonly calendar = inject(CalendarState);
  protected readonly announcementsState = inject(AnnouncementsState);
  protected readonly materials = inject(MaterialsState);
}
