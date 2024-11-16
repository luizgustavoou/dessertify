import { Product } from '@/domain/models/products';
import { createAction, props } from '@ngrx/store';

export const addProduct = createAction(
  '[Cart] Add Product',
  props<{ product: Product }>()
);

export const removeProduct = createAction(
  '[Cart] Remove Product',
  props<{ id: string }>()
);

export const clearProduct = createAction(
  '[Cart] Clear product',
  props<{ id: string }>()
);

export const clear = createAction('[Cart] Clear');
