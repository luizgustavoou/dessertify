import { IAuthState } from '@/application/state/auth.state';
import { createReducer, on } from '@ngrx/store';
import {
  logout,
  signinFailure,
  signinSuccess,
} from '@/application/state/actions/auth.action';

const initialState: IAuthState = {
  token: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(signinSuccess, (state, { token }) => ({
    ...state,
    token,
  })),
  on(signinFailure, (state, { error }) => ({ ...state, error })),
  on(logout, () => initialState)
);
