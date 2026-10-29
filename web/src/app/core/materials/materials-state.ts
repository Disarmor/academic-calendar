import { httpResource } from '@angular/common/http';
import { computed, effect, inject, Service } from '@angular/core';
import { MaterialsFile } from '../../models/materials';
import { ScheduleState } from '../schedule/schedule-state';
import { buildSubjectMaterials, toMaterialItem } from './materials-utils';

/** Учебные материалы по предметам. Файл грузится только на странице материалов. */
@Service()
export class MaterialsState {
  private readonly scheduleState = inject(ScheduleState);
  private readonly resource = httpResource<MaterialsFile>(() => 'data/materials.json');

  readonly isLoading = this.resource.isLoading;
  readonly hasError = computed(() => this.resource.error() !== undefined);

  readonly templates = computed(() => (this.resource.hasValue() ? this.resource.value().templates.map(toMaterialItem) : []));

  readonly subjects = computed(() =>
    this.resource.hasValue() ? buildSubjectMaterials(this.resource.value(), this.scheduleState.subjectColors()) : [],
  );

  constructor() {
    effect(() => {
      const error = this.resource.error();
      if (error) {
        console.error('Не удалось загрузить материалы', error);
      }
    });
  }
}
