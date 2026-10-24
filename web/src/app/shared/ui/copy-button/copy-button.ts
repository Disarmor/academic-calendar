import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { Clipboard } from '../../../core/browser/clipboard';

const COPIED_FEEDBACK_MS = 1500;

/** Текст-кнопка: по нажатию копирует `value` в буфер обмена. Содержимое — через ng-content. */
@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.html',
  styleUrl: './copy-button.scss',
})
export class CopyButton {
  readonly value = input.required<string>();
  /** Описание действия для скринридеров, например «Скопировать ФИО преподавателя». */
  readonly label = input.required<string>();

  private readonly clipboard = inject(Clipboard);
  private resetTimer?: ReturnType<typeof setTimeout>;

  protected readonly copied = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected async copy(): Promise<void> {
    if (!(await this.clipboard.copy(this.value()))) {
      return;
    }
    this.copied.set(true);
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copied.set(false), COPIED_FEEDBACK_MS);
  }
}
