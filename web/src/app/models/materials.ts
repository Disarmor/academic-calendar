import { LessonKind } from './schedule';

/** Вид материала: как у занятий, плюс учебники и рабочие программы. */
export type MaterialKind = LessonKind | 'textbook' | 'program';

export interface MaterialLink {
  readonly title: string;
  /** Путь к файлу внутри `public/`, например `files/poe/lekciya-1.docx`. */
  readonly path: string;
  /** Размер файла в байтах. */
  readonly size: number;
}

export interface MaterialFile extends MaterialLink {
  readonly kind: MaterialKind;
}

export interface SubjectMaterials {
  /** Должен совпадать с `Subject.name` из schedule.json. */
  readonly subject: string;
  /** Что нужно выполнить по предмету. Обычный текст, переносы строк сохраняются. */
  readonly task?: string;
  readonly files: readonly MaterialFile[];
}

export interface MaterialsFile {
  /** Общие шаблоны, например титульный лист. */
  readonly templates: readonly MaterialLink[];
  readonly subjects: readonly SubjectMaterials[];
}
