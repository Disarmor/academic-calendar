import { ViewportScroller } from '@angular/common';
import { afterRenderEffect, Component, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementsState } from '../../core/announcements/announcements-state';
import { CalendarState } from '../../core/calendar/calendar-state';
import { MaterialsState } from '../../core/materials/materials-state';
import { initialModuleId } from '../../core/materials/materials-utils';
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

  /** Выбранная вкладка «Задания к модулю»; по умолчанию текущий модуль или модуль с предметом из якоря. */
  protected readonly selectedModuleId = linkedSignal(() =>
    initialModuleId(this.materials.modules(), this.fragment()),
  );

  /**
   * Выбранный модуль списком из одного элемента: `@for` с `track module.id` пересоздаёт карточки при смене вкладки,
   * иначе раскрытая карточка предмета осталась бы раскрытой и в другом модуле.
   */
  protected readonly selectedModule = computed(() =>
    this.materials.modules().filter((module) => module.id === this.selectedModuleId()),
  );

  constructor() {
    const scroller = inject(ViewportScroller);
    // Роутер прокручивает к якорю до загрузки данных, когда карточек ещё нет, поэтому повторяем после отрисовки.
    afterRenderEffect(() => {
      const fragment = this.fragment();
      if (fragment && this.selectedModule().length > 0) {
        scroller.scrollToAnchor(fragment);
      }
    });
  }
}
