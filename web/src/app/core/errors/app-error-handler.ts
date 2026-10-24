import { ErrorHandler, Injectable } from '@angular/core';

/** Глобальный перехватчик необработанных ошибок. */
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('[academic-calendar] Необработанная ошибка:', error);
  }
}
