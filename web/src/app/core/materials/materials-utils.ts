import { MaterialFile, MaterialKind, MaterialLink, MaterialSectionId, MaterialsFile } from '../../models/materials';
import { Subject, SubjectColor } from '../../models/schedule';

/** Файл, подготовленный к показу: ссылка, формат и размер. */
export interface MaterialItem {
  readonly title: string;
  readonly kind?: MaterialKind;
  readonly href: string;
  /** Расширение в нижнем регистре, например `pdf`. */
  readonly extension: string;
  /** Формат файла, например «PDF». */
  readonly format: string;
  readonly size: string;
  /** Имя при скачивании; `null` — файл открывается в браузере (PDF). */
  readonly download: string | null;
}

export interface MaterialSection {
  readonly id: MaterialSectionId;
  readonly items: readonly MaterialItem[];
}

export interface SubjectMaterialsView {
  /** Код предмета из расписания, он же якорь `#id` на странице. */
  readonly id?: string;
  readonly subject: string;
  readonly color?: SubjectColor;
  readonly task?: string;
  readonly count: number;
  /** Только непустые разделы. */
  readonly sections: readonly MaterialSection[];
}

/** Какие виды попадают в раздел; порядок видов задаёт порядок файлов внутри раздела. */
const SECTION_KINDS: Readonly<Record<MaterialSectionId, readonly MaterialKind[]>> = {
  lectures: ['lecture', 'textbook', 'program'],
  practice: ['practice', 'lab'],
};
const UNITS = ['Б', 'КБ', 'МБ', 'ГБ'];
const FORBIDDEN_FILENAME_CHARS = /[\\/:*?"<>|]/g;

export function fileExtension(path: string): string {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** Размер по-русски: «980 Б», «25 КБ», «10,4 МБ». */
export function formatFileSize(bytes: number): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit++;
  }
  const rounded = value < 10 && unit > 0 ? Math.round(value * 10) / 10 : Math.round(value);
  return `${String(rounded).replace('.', ',')} ${UNITS[unit]}`;
}

export function toMaterialItem(file: MaterialLink | MaterialFile): MaterialItem {
  const extension = fileExtension(file.path);
  return {
    title: file.title,
    kind: 'kind' in file ? file.kind : undefined,
    href: file.path,
    extension,
    format: extension.toUpperCase(),
    size: formatFileSize(file.size),
    download: extension === 'pdf' ? null : `${safeFilename(file.title)}.${extension}`,
  };
}

function safeFilename(title: string): string {
  return title.replace(FORBIDDEN_FILENAME_CHARS, ' ').replace(/\s+/g, ' ').trim();
}

/** Файлы предмета по разделам «лекционные» и «практические»; пустые разделы пропускаются. */
export function splitIntoSections(files: readonly MaterialFile[]): MaterialSection[] {
  return (Object.keys(SECTION_KINDS) as MaterialSectionId[])
    .map((id) => {
      const kinds = SECTION_KINDS[id];
      const items = files
        .filter((file) => kinds.includes(file.kind))
        .sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind))
        .map(toMaterialItem);
      return { id, items };
    })
    .filter((section) => section.items.length > 0);
}

/**
 * Материалы по предметам в порядке расписания; предметы, которых нет в расписании, идут в конце.
 * Внутри предмета файлы разбиты на разделы и сгруппированы по виду, порядок внутри вида — как в данных.
 */
export function buildSubjectMaterials(
  data: MaterialsFile,
  subjects: Readonly<Record<string, Subject>>,
): SubjectMaterialsView[] {
  const subjectOrder = Object.keys(subjects);
  const position = (subject: string): number => {
    const index = subjectOrder.indexOf(subject);
    return index === -1 ? subjectOrder.length : index;
  };
  return [...data.subjects]
    .sort((a, b) => position(a.subject) - position(b.subject))
    .map((entry) => ({
      id: subjects[entry.subject]?.id,
      subject: entry.subject,
      color: subjects[entry.subject]?.color,
      task: entry.task,
      count: entry.files.length,
      sections: splitIntoSections(entry.files),
    }));
}
