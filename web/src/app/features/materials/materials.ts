import { ViewportScroller } from '@angular/common';
import { afterRenderEffect, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
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

  /** Код предмета из ссылки `/materials#poe`: эта карточка раскрыта. */
  protected readonly fragment = toSignal(inject(ActivatedRoute).fragment);

  constructor() {
    const scroller = inject(ViewportScroller);
    // Роутер прокручивает к якорю до загрузки данных, когда карточек ещё нет, поэтому повторяем после отрисовки.
    afterRenderEffect(() => {
      const fragment = this.fragment();
      if (fragment && this.materials.subjects().length > 0) {
        scroller.scrollToAnchor(fragment);
      }
    });
  }
}
