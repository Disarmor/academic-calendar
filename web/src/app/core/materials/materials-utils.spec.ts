import { MaterialsFile } from '../../models/materials';
import { Subject } from '../../models/schedule';
import { buildSubjectMaterials, fileExtension, formatFileSize, toMaterialItem } from './materials-utils';

describe('fileExtension', () => {
  it('возвращает расширение в нижнем регистре', () => {
    expect(fileExtension('files/poe/lekciya-1.DOCX')).toBe('docx');
    expect(fileExtension('files/a.b/file')).toBe('');
  });
});

describe('formatFileSize', () => {
  it('подбирает единицы и округляет', () => {
    expect(formatFileSize(980)).toBe('980 Б');
    expect(formatFileSize(13507)).toBe('13 КБ');
    expect(formatFileSize(2061341)).toBe('2 МБ');
    expect(formatFileSize(5091370)).toBe('4,9 МБ');
    expect(formatFileSize(10939861)).toBe('10 МБ');
  });
});

describe('toMaterialItem', () => {
  it('PDF открывается в браузере', () => {
    const item = toMaterialItem({ title: 'Пособие', kind: 'textbook', path: 'files/x/posobie.pdf', size: 1024 });
    expect(item).toEqual({
      title: 'Пособие',
      kind: 'textbook',
      href: 'files/x/posobie.pdf',
      extension: 'pdf',
      format: 'PDF',
      size: '1 КБ',
      download: null,
    });
  });

  it('остальные файлы скачиваются под читаемым именем без запрещённых символов', () => {
    const item = toMaterialItem({ title: 'Задачи 1/2: «план»?', path: 'files/zadachi.docx', size: 10 });
    expect(item.kind).toBeUndefined();
    expect(item.download).toBe('Задачи 1 2 «план».docx');
  });
});

describe('buildSubjectMaterials', () => {
  const data: MaterialsFile = {
    templates: [],
    subjects: [
      { subject: 'Вне расписания', files: [] },
      {
        subject: 'Б',
        task: 'Сделать',
        files: [
          { title: 'Программа', kind: 'program', path: 'files/b/rp.docx', size: 1 },
          { title: 'Лаба', kind: 'lab', path: 'files/b/lab.docx', size: 1 },
          { title: 'Учебник', kind: 'textbook', path: 'files/b/book.pdf', size: 1 },
          { title: 'Лекция 2', kind: 'lecture', path: 'files/b/l2.pdf', size: 1 },
          { title: 'Практика', kind: 'practice', path: 'files/b/pr.pdf', size: 1 },
          { title: 'Лекция 1', kind: 'lecture', path: 'files/b/l1.pdf', size: 1 },
        ],
      },
      {
        subject: 'А',
        files: [{ title: 'Практика А', kind: 'practice', path: 'files/a/pr.pdf', size: 1 }],
      },
    ],
  };

  const subjects: Readonly<Record<string, Subject>> = {
    А: { id: 'a', name: 'А', color: 'cyan' },
    Б: { id: 'b', name: 'Б', color: 'rose' },
  };

  it('сортирует предметы по расписанию и берёт из него код и цвет', () => {
    const result = buildSubjectMaterials(data, subjects);
    expect(result.map((entry) => entry.subject)).toEqual(['А', 'Б', 'Вне расписания']);
    expect(result.map((entry) => entry.id)).toEqual(['a', 'b', undefined]);
    expect(result.map((entry) => entry.color)).toEqual(['cyan', 'rose', undefined]);
    expect(result.map((entry) => entry.count)).toEqual([1, 6, 0]);
    expect(result[1].task).toBe('Сделать');
  });

  it('делит файлы на лекционные и практические, внутри — по виду с сохранением порядка', () => {
    const [a, b, outside] = buildSubjectMaterials(data, subjects);
    const titles = (sections: typeof b.sections) =>
      sections.map((section) => [section.id, section.items.map((item) => item.title)]);
    expect(titles(b.sections)).toEqual([
      ['lectures', ['Лекция 2', 'Лекция 1', 'Учебник', 'Программа']],
      ['practice', ['Практика', 'Лаба']],
    ]);
    expect(titles(a.sections)).toEqual([['practice', ['Практика А']]]);
    expect(outside.sections).toEqual([]);
  });
});
