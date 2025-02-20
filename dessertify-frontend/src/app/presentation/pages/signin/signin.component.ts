import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { signin } from '@/application/state/actions/auth.action';
import { FormsModule } from '@angular/forms';
import { AppState } from '@/application/state/app.state';
import { CommonModule } from '@angular/common';
// import { selectAuthError } from '@/application/state/selectors/auth.selector';

@Component({
  standalone: true,
  selector: 'app-signin',
  template: `
    <div
      class="flex justify-center items-center min-h-screen gap-7 p-14 bg-rose-100"
    >
      <form (submit)="onSubmit()">
        <input
          type="email"
          [(ngModel)]="email"
          name="email"
          placeholder="Email"
          required
          autocomplete="email"
        />
        <input
          type="password"
          [(ngModel)]="password"
          name="password"
          placeholder="Senha"
          required
          autocomplete="current-password"
        />
        <!-- <p *ngIf="error$ | async as error" class="text-red-500">{{ error }}</p> -->

        <button type="submit">Signin</button>
      </form>
    </div>
  `,
  imports: [FormsModule, CommonModule],
})
export class SigninComponent {
  email = '';
  password = '';

  store = inject(Store<AppState>);

  // error$ = this.store.select(selectAuthError);

  onSubmit() {
    console.log('vou fazer login!!');
    console.log({ email: this.email, password: this.password });
    this.store.dispatch(signin({ email: this.email, password: this.password }));
  }
}
