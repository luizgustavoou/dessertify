import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICartState } from '../states/cart.state';

export const selectCartState = createFeatureSelector<ICartState>('cart');

export const selectCartProducts = createSelector(
  selectCartState,
  (state: ICartState) => state.products
);

export const selectCartTotal = createSelector(
  selectCartState,
  (state: ICartState) => state.products.length
);
