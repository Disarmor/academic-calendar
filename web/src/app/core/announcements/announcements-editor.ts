import { computed, inject, Service, signal } from '@angular/core';
import { Announcement } from '../../models/announcement';
import { GithubContents, GithubError } from '../github/github-contents';
import { ANNOUNCEMENTS_FILE_PATH } from '../github/github-utils';
import { Clock } from '../time/clock';
import {
  announcementErrors,
  AnnouncementStatus,
  announcementStatus,
  normalizeAnnouncement,
  parseAnnouncementsFile,
  serializeAnnouncements,
} from './announcements-utils';

const COMMIT_MESSAGE = 'Объявления: обновлены через страницу старосты';

/** `loading` — вход по токену, `reloading` — повторная загрузка уже открытого редактора. */
export type EditorPhase = 'signed-out' | 'loading' | 'ready' | 'reloading' | 'saving';

interface DraftEntry {
  /** Локальный ключ записи, чтобы отличать объявления с одинаковым заголовком. */
  readonly key: number;
  readonly announcement: Announcement;
}

export interface DraftItem extends DraftEntry {
  readonly status: AnnouncementStatus;
}

/**
 * Редактор объявлений для старосты. Правки копятся в черновике и публикуются одним коммитом.
 * Токен GitHub хранится только в памяти вкладки и стирается при выходе или перезагрузке.
 */
@Service()
export class AnnouncementsEditor {
  private readonly github = inject(GithubContents);
  private readonly clock = inject(Clock);

  private token = '';
  private nextKey = 0;
  private sha = '';
  private readonly published = signal<readonly Announcement[]>([]);
  private readonly draft = signal<readonly DraftEntry[]>([]);

  readonly phase = signal<EditorPhase>('signed-out');
  readonly error = signal<string | null>(null);
  /** Последняя публикация прошла успешно, а новых правок ещё нет. */
  readonly justPublished = signal(false);

  readonly items = computed<DraftItem[]>(() => {
    const today = this.clock.today();
    return [...this.draft()]
      .sort((a, b) => b.announcement.date.localeCompare(a.announcement.date))
      .map((entry) => ({ ...entry, status: announcementStatus(entry.announcement, today) }));
  });

  readonly isDirty = computed(
    () => serializeAnnouncements(this.draftAnnouncements()) !== serializeAnnouncements(this.published()),
  );

  async signIn(token: string): Promise<void> {
    this.token = token.trim();
    await this.load();
    if (this.phase() !== 'ready') {
      this.token = '';
    }
  }

  signOut(): void {
    this.token = '';
    this.sha = '';
    this.published.set([]);
    this.draft.set([]);
    this.error.set(null);
    this.justPublished.set(false);
    this.phase.set('signed-out');
  }

  /** Загружает объявления с GitHub; несохранённые правки при этом теряются. */
  async load(): Promise<void> {
    const wasReady = this.phase() === 'ready';
    // При повторной загрузке редактор остаётся на экране, форма входа не мелькает.
    this.phase.set(wasReady ? 'reloading' : 'loading');
    this.error.set(null);
    try {
      const file = await this.github.read(ANNOUNCEMENTS_FILE_PATH, this.token);
      const announcements = parseAnnouncementsFile(file.text);
      this.sha = file.sha;
      this.published.set(announcements);
      this.resetDraft(announcements);
      this.justPublished.set(false);
      this.phase.set('ready');
    } catch (error) {
      this.fail(error);
      this.phase.set(wasReady ? 'ready' : 'signed-out');
    }
  }

  /** Добавляет объявление (без `key`) или заменяет существующее. */
  save(announcement: Announcement, key?: number): void {
    if (announcementErrors(announcement).length > 0) {
      return;
    }
    const item = normalizeAnnouncement(announcement);
    this.draft.update((entries) =>
      key === undefined
        ? [...entries, { key: this.nextKey++, announcement: item }]
        : entries.map((entry) => (entry.key === key ? { key, announcement: item } : entry)),
    );
    this.justPublished.set(false);
  }

  remove(key: number): void {
    this.draft.update((entries) => entries.filter((entry) => entry.key !== key));
    this.justPublished.set(false);
  }

  discard(): void {
    this.resetDraft(this.published());
    this.error.set(null);
  }

  async publish(): Promise<void> {
    if (!this.isDirty() || this.phase() !== 'ready') {
      return;
    }
    const announcements = this.draftAnnouncements();
    this.phase.set('saving');
    this.error.set(null);
    try {
      this.sha = await this.github.write(ANNOUNCEMENTS_FILE_PATH, this.token, {
        text: serializeAnnouncements(announcements),
        sha: this.sha,
        message: COMMIT_MESSAGE,
      });
      this.published.set(announcements.map(normalizeAnnouncement));
      this.justPublished.set(true);
    } catch (error) {
      this.fail(error);
    } finally {
      this.phase.set('ready');
    }
  }

  private draftAnnouncements(): Announcement[] {
    return this.draft().map((entry) => entry.announcement);
  }

  private resetDraft(announcements: readonly Announcement[]): void {
    this.draft.set(announcements.map((announcement) => ({ key: this.nextKey++, announcement })));
  }

  private fail(error: unknown): void {
    if (!(error instanceof GithubError)) {
      console.error('Ошибка редактора объявлений', error);
    }
    this.error.set(error instanceof Error ? error.message : 'Неизвестная ошибка.');
  }
}
