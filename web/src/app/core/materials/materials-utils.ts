import { MaterialFile, MaterialKind, MaterialLink, MaterialsFile } from '../../models/materials';
import { SubjectColor } from '../../models/schedule';

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

export interface SubjectMaterialsView {
  readonly subject: string;
  readonly color?: SubjectColor;
  readonly task?: string;
  readonly items: readonly MaterialItem[];
}

const KIND_ORDER: readonly MaterialKind[] = ['lecture', 'practice', 'lab', 'textbook', 'program'];
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

/**
 * Материалы по предметам в порядке расписания; предметы, которых нет в расписании, идут в конце.
 * Внутри предмета файлы сгруппированы по виду, порядок внутри вида — как в данных.
 */
export function buildSubjectMaterials(
  data: MaterialsFile,
  subjectColors: Readonly<Record<string, SubjectColor>>,
): SubjectMaterialsView[] {
  const subjectOrder = Object.keys(subjectColors);
  const position = (subject: string): number => {
    const index = subjectOrder.indexOf(subject);
    return index === -1 ? subjectOrder.length : index;
  };
  return [...data.subjects]
    .sort((a, b) => position(a.subject) - position(b.subject))
    .map((entry) => ({
      subject: entry.subject,
      color: subjectColors[entry.subject],
      task: entry.task,
      items: [...entry.files]
        .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind))
        .map(toMaterialItem),
    }));
}
