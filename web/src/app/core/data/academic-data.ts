import { httpResource } from '@angular/common/http';
import { computed, effect, Service } from '@angular/core';
import { AcademicCalendar } from '../../models/academic-calendar';
import { Schedule } from '../../models/schedule';

/** Загрузка JSON-данных из public/data. */
@Service()
export class AcademicData {
  readonly calendar = httpResource<AcademicCalendar>(() => 'data/calendar.json');
  readonly schedule = httpResource<Schedule>(() => 'data/schedule.json');

  readonly error = computed(() => this.calendar.error() ?? this.schedule.error());

  constructor() {
    effect(() => {
      const error = this.error();
      if (error) {
        console.error('Не удалось загрузить данные', error);
      }
    });
  }
}
