import { computed, inject, Service } from '@angular/core';
import { AcademicData } from '../data/academic-data';
import { Clock } from '../time/clock';
import { archivedAnnouncements, visibleAnnouncements } from './announcements-utils';

/** Объявления старосты: актуальные и архив. */
@Service()
export class AnnouncementsState {
  private readonly clock = inject(Clock);
  private readonly resource = inject(AcademicData).announcements;
  private readonly all = computed(() => (this.resource.hasValue() ? this.resource.value().announcements : []));

  readonly announcements = computed(() => visibleAnnouncements(this.all(), this.clock.today()));
  readonly archive = computed(() => archivedAnnouncements(this.all(), this.clock.today()));
  readonly hasError = computed(() => this.resource.error() !== undefined);
}
