import { Announcement } from '../../models/announcement';
import { visibleAnnouncements } from './announcements-utils';

const note = (title: string, overrides: Partial<Announcement> = {}): Announcement => ({
  title,
  text: 'Текст',
  date: '2026-10-20',
  ...overrides,
});

describe('visibleAnnouncements', () => {
  it('скрывает будущие и истёкшие объявления (последний день включительно)', () => {
    const list = [
      note('Будущее', { date: '2026-10-25' }),
      note('Истёкшее', { expires: '2026-10-23' }),
      note('Последний день', { expires: '2026-10-24' }),
    ];
    expect(visibleAnnouncements(list, '2026-10-24').map((item) => item.title)).toEqual(['Последний день']);
  });

  it('ставит закреплённые первыми, остальные — от новых к старым', () => {
    const list = [
      note('Старое', { date: '2026-10-01' }),
      note('Закреплённое', { date: '2026-09-15', pinned: true }),
      note('Новое', { date: '2026-10-22' }),
    ];
    expect(visibleAnnouncements(list, '2026-10-24').map((item) => item.title)).toEqual([
      'Закреплённое',
      'Новое',
      'Старое',
    ]);
  });
});
