import { LocalDate } from '../../models/academic-calendar';
import { Announcement, AnnouncementsFile } from '../../models/announcement';
import { isValidLocalDate } from '../time/local-date';

export const ANNOUNCEMENT_TITLE_MAX = 120;
export const ANNOUNCEMENT_TEXT_MAX = 2000;

/** Состояние объявления на дату: ещё не опубликовано, показывается или уже скрыто. */
export type AnnouncementStatus = 'scheduled' | 'active' | 'expired';

/**
 * Объявления, актуальные на дату: уже опубликованные и не истёкшие.
 * Закреплённые идут первыми, остальные — от новых к старым.
 */
export function visibleAnnouncements(announcements: readonly Announcement[], today: LocalDate): Announcement[] {
  return announcements
    .filter((item) => announcementStatus(item, today) === 'active')
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.date.localeCompare(a.date));
}

/** Архив: объявления, срок показа которых закончился, от новых к старым. */
export function archivedAnnouncements(announcements: readonly Announcement[], today: LocalDate): Announcement[] {
  return announcements
    .filter((item) => announcementStatus(item, today) === 'expired')
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function announcementStatus(item: Announcement, today: LocalDate): AnnouncementStatus {
  if (today < item.date) {
    return 'scheduled';
  }
  return item.expires && item.expires < today ? 'expired' : 'active';
}

/** Ошибки объявления на русском; пустой массив — объявление корректно. */
export function announcementErrors(item: Announcement): string[] {
  const errors: string[] = [];
  const title = item.title.trim();
  const text = item.text.trim();
  if (!title) {
    errors.push('Укажите заголовок.');
  } else if (title.length > ANNOUNCEMENT_TITLE_MAX) {
    errors.push(`Заголовок длиннее ${ANNOUNCEMENT_TITLE_MAX} символов.`);
  }
  if (!text) {
    errors.push('Укажите текст.');
  } else if (text.length > ANNOUNCEMENT_TEXT_MAX) {
    errors.push(`Текст длиннее ${ANNOUNCEMENT_TEXT_MAX} символов.`);
  }
  if (!isValidLocalDate(item.date)) {
    errors.push('Некорректная дата публикации.');
  }
  if (item.expires !== undefined) {
    if (!isValidLocalDate(item.expires)) {
      errors.push('Некорректная дата окончания показа.');
    } else if (item.expires < item.date) {
      errors.push('Показ не может закончиться раньше публикации.');
    }
  }
  return errors;
}

/** Объявление в том виде, в каком оно хранится: без лишних пробелов и пустых необязательных полей. */
export function normalizeAnnouncement(item: Announcement): Announcement {
  return {
    title: item.title.trim(),
    text: item.text.trim(),
    date: item.date,
    ...(item.pinned ? { pinned: true } : {}),
    ...(item.expires ? { expires: item.expires } : {}),
  };
}

function isAnnouncement(value: unknown): value is Announcement {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item['title'] === 'string' &&
    typeof item['text'] === 'string' &&
    typeof item['date'] === 'string' &&
    (item['pinned'] === undefined || typeof item['pinned'] === 'boolean') &&
    (item['expires'] === undefined || typeof item['expires'] === 'string')
  );
}

/** Разбор announcements.json с проверкой формы; при ошибке бросает исключение с понятным текстом. */
export function parseAnnouncementsFile(text: string): Announcement[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Файл объявлений повреждён: это не JSON.');
  }
  const list = (data as Partial<AnnouncementsFile> | null)?.announcements;
  if (!Array.isArray(list) || !list.every(isAnnouncement)) {
    throw new Error('Файл объявлений повреждён: неверная структура.');
  }
  return list;
}

/** Содержимое announcements.json:объявления от новых к старым, отступ 2 пробела, перевод строки в конце. */
export function serializeAnnouncements(announcements: readonly Announcement[]): string {
  const file: AnnouncementsFile = {
    announcements: announcements.map(normalizeAnnouncement).sort((a, b) => b.date.localeCompare(a.date)),
  };
  return `${JSON.stringify(file, null, 2)}\n`;
}
