import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { toZonedDateTime } from './local-date';

const TICK_MS = 30_000;

/** Единственный источник текущего времени в приложении (по Бишкеку). */
@Service()
export class Clock {
  private readonly instant = signal(new Date());

  readonly now = computed(() => toZonedDateTime(this.instant()));
  readonly today = computed(() => this.now().date);

  constructor() {
    const timer = setInterval(() => this.instant.set(new Date()), TICK_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
