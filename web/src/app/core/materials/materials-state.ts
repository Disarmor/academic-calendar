import { httpResource } from '@angular/common/http';
import { computed, effect, inject, Service } from '@angular/core';
import { MaterialsFile } from '../../models/materials';
import { ScheduleState } from '../schedule/schedule-state';
import { buildModules, toMaterialItem } from './materials-utils';

/** Учебные материалы по предметам. Файл грузится только на странице материалов. */
@Service()
export class MaterialsState {
  private readonly scheduleState = inject(ScheduleState);
  private readonly resource = httpResource<MaterialsFile>(() => 'data/materials.json');

  readonly isLoading = this.resource.isLoading;
  readonly hasError = computed(() => this.resource.error() !== undefined);

  readonly templates = computed(() =>
    this.resource.hasValue() ? this.resource.value().templates.map(toMaterialItem) : [],
  );

  /** Задания к модулям: каждый модуль — отдельная вкладка. */
  readonly modules = computed(() =>
    this.resource.hasValue()
      ? buildModules(this.resource.value().modules, this.scheduleState.subjects())
      : [],
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
