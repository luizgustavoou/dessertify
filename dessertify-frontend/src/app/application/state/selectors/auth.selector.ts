import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState } from '@/application/state/auth.state';

export const selectAuthState = createFeatureSelector<IAuthState>('auth');

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const isAuthenticated = createSelector(selectToken, (token) => !!token);

// export const selectAuthError = createSelector(
//   selectAuthState,
//   (state) => state.error
// );
