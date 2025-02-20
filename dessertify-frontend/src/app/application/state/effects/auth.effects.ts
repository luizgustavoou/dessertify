import { AuthApi } from '@/infra/http/auth/auth.api';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  signin,
  signinFailure,
  signinSuccess,
} from '@/application/state/actions/auth.action';
import { catchError, map, mergeMap, of, tap, timeout } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authApi = inject(AuthApi);
  private router = inject(Router);

  signin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signin),
      mergeMap(({ email, password }) => {
        return this.authApi.signin({ email, password }).pipe(
          map((res) => {
            return signinSuccess({ token: res.access_token });
          }),
          catchError((error) => {
            return of(
              signinFailure({ error: error.message || 'Erro desconhecido' })
            );
          })
        );
      })
    )
  );

  signinSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signinSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
    {
      dispatch: false,
    }
  );

  // siginFailure$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(signinFailure),
  //     tap(({ error }) => {
  //       alert('Erro no login: ' + (error || 'Erro desconhecido'));
  //     })
  //   )
  // );
}
