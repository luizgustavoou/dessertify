import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { signin } from '@/application/state/actions/auth.action';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppState } from '@/application/state/app.state';
import { CommonModule } from '@angular/common';
import { selectToken } from '@/application/state/selectors/auth.selector';
import { MaterialModule } from '@/shared/material.module';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-signin',
  template: `
    <div class="flex justify-center items-center min-h-screen p-6 bg-rose-100">
      <div
        class="rounded-lg p-8 bg-rose-200/70 shadow-2xl flex flex-col justify-center items-center max-w-lg w-full"
      >
        <img
          src="./assets/images/logo-1.png"
          alt="logo"
          class="max-w-full w-72"
        />

        <form
          [formGroup]="signinForm"
          class="flex flex-col gap-6 w-full"
          (ngSubmit)="onSubmit()"
        >
          <mat-form-field appearance="outline" class="w-full">
            <input matInput placeholder="Email" formControlName="email" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <input
              matInput
              placeholder="Password"
              formControlName="password"
              type="password"
            />
          </mat-form-field>

          <button mat-raised-button color="primary" class="w-full py-3 text-lg">
            Signin
            <mat-icon iconPositionEnd>login</mat-icon>
          </button>
        </form>
      </div>
    </div>
  `,
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class SigninComponent {
  store = inject(Store<AppState>);
  fb = inject(FormBuilder);

  signinForm = this.fb.group({
    email: [
      'luizgustavooumbelino@gmail.com',
      [Validators.email, Validators.required],
    ],
    password: ['123456', [Validators.required]],
  });

  token$ = this.store.select(selectToken);

  onSubmit() {
    if (this.signinForm.invalid) {
      return;
    }

    this.store.dispatch(
      signin({
        email: this.signinForm.value.email as string,
        password: this.signinForm.value.password as string,
      })
    );
  }
}
