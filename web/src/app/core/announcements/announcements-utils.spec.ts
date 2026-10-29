import { Announcement } from '../../models/announcement';
import {
  announcementErrors,
  announcementStatus,
  archivedAnnouncements,
  parseAnnouncementsFile,
  serializeAnnouncements,
  visibleAnnouncements,
} from './announcements-utils';

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

describe('archivedAnnouncements', () => {
  it('собирает истёкшие объявления от новых к старым, без текущих и будущих', () => {
    const list = [
      note('Старое', { date: '2026-09-01', expires: '2026-09-10' }),
      note('Текущее'),
      note('Будущее', { date: '2026-10-30' }),
      note('Недавнее', { date: '2026-10-01', expires: '2026-10-23', pinned: true }),
    ];
    expect(archivedAnnouncements(list, '2026-10-24').map((item) => item.title)).toEqual(['Недавнее', 'Старое']);
  });
});

describe('announcementStatus', () => {
  it('различает запланированные, показываемые и скрытые', () => {
    expect(announcementStatus(note('А', { date: '2026-10-25' }), '2026-10-24')).toBe('scheduled');
    expect(announcementStatus(note('А', { expires: '2026-10-24' }), '2026-10-24')).toBe('active');
    expect(announcementStatus(note('А', { expires: '2026-10-23' }), '2026-10-24')).toBe('expired');
  });
});

describe('announcementErrors', () => {
  it('принимает корректное объявление', () => {
    expect(announcementErrors(note('Собрание', { expires: '2026-10-20' }))).toEqual([]);
  });

  it('находит пустые поля, неверные даты и конец показа раньше начала', () => {
    expect(announcementErrors({ title: ' ', text: '', date: '2026-02-30' })).toEqual([
      'Укажите заголовок.',
      'Укажите текст.',
      'Некорректная дата публикации.',
    ]);
    expect(announcementErrors(note('А', { expires: '2026-10-19' }))).toEqual([
      'Показ не может закончиться раньше публикации.',
    ]);
    expect(announcementErrors(note('А'.repeat(121)))).toEqual(['Заголовок длиннее 120 символов.']);
  });
});

describe('serializeAnnouncements', () => {
  it('убирает пробелы и пустые поля, сортирует от новых к старым', () => {
    const text = serializeAnnouncements([
      { title: ' Старое ', text: 'Текст\n', date: '2026-10-01', pinned: false },
      { title: 'Новое', text: 'Текст', date: '2026-10-20', pinned: true, expires: '2026-10-30' },
    ]);
    expect(text.endsWith('}\n')).toBe(true);
    expect(JSON.parse(text)).toEqual({
      announcements: [
        { title: 'Новое', text: 'Текст', date: '2026-10-20', pinned: true, expires: '2026-10-30' },
        { title: 'Старое', text: 'Текст', date: '2026-10-01' },
      ],
    });
  });
});

describe('parseAnnouncementsFile', () => {
  it('читает корректный файл', () => {
    expect(parseAnnouncementsFile('{"announcements":[{"title":"А","text":"Б","date":"2026-10-01"}]}')).toEqual([
      { title: 'А', text: 'Б', date: '2026-10-01' },
    ]);
  });

  it('отклоняет не JSON и неверную структуру', () => {
    expect(() => parseAnnouncementsFile('{')).toThrow('это не JSON');
    expect(() => parseAnnouncementsFile('{"announcements":[{"title":1}]}')).toThrow('неверная структура');
    expect(() => parseAnnouncementsFile('null')).toThrow('неверная структура');
  });
});
