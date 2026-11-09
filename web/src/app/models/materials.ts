import { LessonKind } from './schedule';

/** Вид материала: как у занятий, плюс учебники и рабочие программы. */
export type MaterialKind = LessonKind | 'textbook' | 'program';

/** Раздел на странице: лекционные (лекции, учебники, программа) и практические (практики, лабораторные). */
export type MaterialSectionId = 'lectures' | 'practice';

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

/** Задания и материалы к одному модулю (текущему контролю). */
export interface MaterialsModule {
  /** Код модуля для вкладки, например `module-1`. */
  readonly id: string;
  /** Подпись вкладки, например «Модуль 1». */
  readonly title: string;
  readonly subjects: readonly SubjectMaterials[];
}

export interface MaterialsFile {
  /** Общие шаблоны, например титульный лист. */
  readonly templates: readonly MaterialLink[];
  /** Модули по порядку; по умолчанию открыт последний (текущий). */
  readonly modules: readonly MaterialsModule[];
}
