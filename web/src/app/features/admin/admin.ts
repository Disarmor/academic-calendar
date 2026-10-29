import { Component, computed, inject, signal } from '@angular/core';
import { AnnouncementsEditor } from '../../core/announcements/announcements-editor';
import { AnnouncementsState } from '../../core/announcements/announcements-state';
import { CalendarState } from '../../core/calendar/calendar-state';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { AnnouncementForm, AnnouncementSave } from './announcement-form/announcement-form';
import { AnnouncementList } from './announcement-list/announcement-list';
import { TokenForm } from './token-form/token-form';

@Component({
  imports: [PageHeader, TokenForm, AnnouncementList, AnnouncementForm],
  selector: 'app-admin',
  styleUrl: './admin.scss',
  templateUrl: './admin.html',
  host: {
    '(window:beforeunload)': 'warnAboutUnsavedChanges($event)',
  },
})
export class Admin {
  protected readonly calendar = inject(CalendarState);
  protected readonly announcementsState = inject(AnnouncementsState);
  protected readonly editor = inject(AnnouncementsEditor);

  protected readonly editingKey = signal<number | undefined>(undefined);
  protected readonly editing = computed(
    () => this.editor.items().find((item) => item.key === this.editingKey()) ?? null,
  );
  protected readonly signedIn = computed(() => {
    const phase = this.editor.phase();
    return phase === 'ready' || phase === 'saving';
  });

  protected save(event: AnnouncementSave): void {
    this.editor.save(event.announcement, event.key);
    this.editingKey.set(undefined);
  }

  protected remove(key: number): void {
    this.editor.remove(key);
    if (this.editingKey() === key) {
      this.editingKey.set(undefined);
    }
  }

  protected discard(): void {
    this.editor.discard();
    this.editingKey.set(undefined);
  }

  protected reload(): void {
    this.editingKey.set(undefined);
    void this.editor.load();
  }

  protected signOut(): void {
    this.editingKey.set(undefined);
    this.editor.signOut();
  }

  protected warnAboutUnsavedChanges(event: BeforeUnloadEvent): void {
    if (this.editor.isDirty()) {
      event.preventDefault();
    }
  }
}
