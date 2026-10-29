import { TestBed } from '@angular/core/testing';
import { GithubContents, GithubError } from '../github/github-contents';
import { AnnouncementsEditor } from './announcements-editor';

const FILE = '{"announcements":[{"title":"Старое","text":"Текст","date":"2026-10-01"}]}';

function setup(readError?: GithubError) {
  const github = {
    read: vi.fn(async () => {
      if (readError) {
        throw readError;
      }
      return { text: FILE, sha: 'sha-1' };
    }),
    write: vi.fn(async () => 'sha-2'),
  };
  TestBed.configureTestingModule({ providers: [{ provide: GithubContents, useValue: github }] });
  return { editor: TestBed.inject(AnnouncementsEditor), github };
}

describe('AnnouncementsEditor', () => {
  it('загружает объявления, копит правки и публикует их одним коммитом', async () => {
    const { editor, github } = setup();
    await editor.signIn(' token ');
    expect(github.read).toHaveBeenCalledWith('web/public/data/announcements.json', 'token');
    expect(editor.phase()).toBe('ready');
    expect(editor.isDirty()).toBe(false);

    editor.save({ title: 'Новое', text: 'Текст', date: '2026-10-20' });
    const [created, old] = editor.items();
    expect(created.announcement.title).toBe('Новое');
    editor.save({ ...old.announcement, title: 'Старое, исправлено' }, old.key);
    expect(editor.isDirty()).toBe(true);

    await editor.publish();
    const [, , update] = github.write.mock.calls[0] as unknown as [string, string, { text: string; sha: string }];
    expect(update.sha).toBe('sha-1');
    expect(JSON.parse(update.text).announcements.map((item: { title: string }) => item.title)).toEqual([
      'Новое',
      'Старое, исправлено',
    ]);
    expect(editor.isDirty()).toBe(false);
    expect(editor.justPublished()).toBe(true);
  });

  it('не принимает некорректное объявление', async () => {
    const { editor } = setup();
    await editor.signIn('token');
    editor.save({ title: '', text: 'Текст', date: '2026-10-20' });
    expect(editor.items().length).toBe(1);
  });

  it('при неверном токене остаётся на входе и показывает ошибку', async () => {
    const { editor } = setup(new GithubError(401));
    await editor.signIn('bad');
    expect(editor.phase()).toBe('signed-out');
    expect(editor.error()).toContain('Токен не подошёл');
  });
});
