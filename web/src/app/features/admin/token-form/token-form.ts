import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GITHUB_NEW_TOKEN_URL } from '../../../core/github/github-utils';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-token-form',
  styleUrl: './token-form.scss',
  templateUrl: './token-form.html',
})
export class TokenForm {
  readonly busy = input(false);
  readonly error = input<string | null>(null);
  readonly submitted = output<string>();

  // [formGroup] на <form> обязателен: без него Angular не перехватывает отправку,
  // браузер шлёт форму сам, и CSP (form-action 'none') её блокирует.
  protected readonly form = new FormGroup({
    token: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  protected readonly newTokenUrl = GITHUB_NEW_TOKEN_URL;

  protected submit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.controls.token.value);
      this.form.reset();
    }
  }
}
