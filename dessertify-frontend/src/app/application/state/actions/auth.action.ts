import { createAction, props } from '@ngrx/store';

export const signin = createAction(
  '[Auth] Signin',
  props<{ email: string; password: string }>()
);

export const signinSuccess = createAction(
  '[Auth] Signin Success',
  props<{
    token: string;
  }>()
);

export const signinFailure = createAction(
  '[Auth] Signin Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');
