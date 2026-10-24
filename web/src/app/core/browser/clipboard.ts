import { Service } from '@angular/core';

/** Копирование текста в буфер обмена. Работает только в защищённом контексте (https, localhost). */
@Service()
export class Clipboard {
  async copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Не удалось скопировать в буфер обмена', error);
      return false;
    }
  }
}
