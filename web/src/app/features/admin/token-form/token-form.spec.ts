import { TestBed } from '@angular/core/testing';
import { TokenForm } from './token-form';

describe('TokenForm', () => {
  it('отправка формы перехватывается Angular и отдаёт токен, а не уходит браузеру', async () => {
    const fixture = TestBed.createComponent(TokenForm);
    const emitted: string[] = [];
    fixture.componentInstance.submitted.subscribe((token) => emitted.push(token));
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = 'github_pat_test';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const submit = new SubmitEvent('submit', { cancelable: true });
    element.querySelector('form')?.dispatchEvent(submit);

    expect(emitted).toEqual(['github_pat_test']);
    // Без [formGroup] событие не отменяется, и браузер отправил бы форму сам (CSP её заблокирует).
    expect(submit.defaultPrevented).toBe(true);
  });
});
