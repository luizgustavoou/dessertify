import { IAuthState } from '@/application/state/auth.state';
import { createReducer, on } from '@ngrx/store';
import {
  logout,
  signin,
  signinFailure,
  signinSuccess,
} from '@/application/state/actions/auth.action';

const initialState: IAuthState = {
  token: null,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(signin, (state, {}) => ({
    ...state,
    loading: true,
  })),
  on(signinSuccess, (state, { token }) => ({
    ...state,
    error: null,
    loading: false,
    token,
  })),
  on(signinFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(logout, () => initialState)
);
