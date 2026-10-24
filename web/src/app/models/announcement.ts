import { LocalDate } from './academic-calendar';

export interface Announcement {
  readonly title: string;
  /** Обычный текст; переносы строк сохраняются, HTML не поддерживается. */
  readonly text: string;
  /** Дата публикации. */
  readonly date: LocalDate;
  /** Закреплённые объявления показываются первыми. */
  readonly pinned?: boolean;
  /** Последний день показа (включительно); после него объявление скрывается. */
  readonly expires?: LocalDate;
}

export interface AnnouncementsFile {
  readonly announcements: readonly Announcement[];
}
