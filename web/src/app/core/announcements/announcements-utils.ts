import { LocalDate } from '../../models/academic-calendar';
import { Announcement } from '../../models/announcement';

/**
 * Объявления, актуальные на дату: уже опубликованные и не истёкшие.
 * Закреплённые идут первыми, остальные — от новых к старым.
 */
export function visibleAnnouncements(announcements: readonly Announcement[], today: LocalDate): Announcement[] {
  return announcements
    .filter((item) => item.date <= today && (!item.expires || today <= item.expires))
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.date.localeCompare(a.date));
}
