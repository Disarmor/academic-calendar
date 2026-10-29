import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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

  protected readonly token = new FormControl('', { nonNullable: true, validators: Validators.required });
  protected readonly newTokenUrl = GITHUB_NEW_TOKEN_URL;

  protected submit(): void {
    if (this.token.valid) {
      this.submitted.emit(this.token.value);
      this.token.reset();
    }
  }
}
