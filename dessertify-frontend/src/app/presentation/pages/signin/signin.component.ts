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
// import { selectAuthError } from '@/application/state/selectors/auth.selector';

@Component({
  standalone: true,
  selector: 'app-signin',
  template: `
    <div
      class="flex justify-center items-center min-h-screen gap-7 p-14 bg-rose-100"
    >
      <form
        [formGroup]="signinForm"
        class="flex flex-col gap-7 min-w-[650px]"
        (ngSubmit)="onSubmit()"
      >
        <mat-form-field appearance="fill">
          <input matInput placeholder="Email" formControlName="email" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <input
            matInput
            placeholder="Password"
            formControlName="password"
            type="password"
          />
        </mat-form-field>

        <button mat-raised-button>Signin</button>
      </form>
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
    email: ['luizgustavooumbelino@gmail.com', [Validators.email]],
    password: ['', [Validators.required]],
  });

  token$ = this.store.select(selectToken);

  onSubmit() {
    console.log(this.signinForm)
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
