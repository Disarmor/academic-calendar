import { WeekType } from '../models/academic-calendar';
import { MaterialKind } from '../models/materials';
import { LessonKind, Weekday } from '../models/schedule';

export const WEEK_TYPE_LABELS: Readonly<Record<WeekType, string>> = {
  numerator: 'Числитель',
  denominator: 'Знаменатель',
};

export const LESSON_KIND_LABELS: Readonly<Record<LessonKind, string>> = {
  lecture: 'Лекция',
  practice: 'Практика',
  lab: 'Лабораторная',
};

export const MATERIAL_KIND_LABELS: Readonly<Record<MaterialKind, string>> = {
  ...LESSON_KIND_LABELS,
  textbook: 'Учебник',
  program: 'Программа',
};

export const WEEKDAY_LABELS: Readonly<Record<Weekday, string>> = {
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
  7: 'Воскресенье',
};
