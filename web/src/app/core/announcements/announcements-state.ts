import { computed, inject, Service } from '@angular/core';
import { AcademicData } from '../data/academic-data';
import { Clock } from '../time/clock';
import { visibleAnnouncements } from './announcements-utils';

/** Актуальные объявления старосты. */
@Service()
export class AnnouncementsState {
  private readonly clock = inject(Clock);
  private readonly resource = inject(AcademicData).announcements;

  readonly announcements = computed(() =>
    this.resource.hasValue() ? visibleAnnouncements(this.resource.value().announcements, this.clock.today()) : [],
  );
  readonly hasError = computed(() => this.resource.error() !== undefined);
}
