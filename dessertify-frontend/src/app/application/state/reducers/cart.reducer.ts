import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../domain/models/products';
import { ICartState } from '../cart.state';
import {
  addProduct,
  clear,
  clearProduct,
  removeProduct,
} from '../actions/cart.action';

export const initialState: ICartState = {
  products: [],
};

export const cartReducer = createReducer(
  initialState,
  on(addProduct, (state, { product }) => {
    const products = [...state.products];

    const productIndex = products.findIndex(
      (cartProduct: Product) => cartProduct.id === product.id
    );

    if (productIndex >= 0) {
      products[productIndex] = {
        ...products[productIndex],
        quantity: products[productIndex].quantity + 1,
      };
    } else {
      products.push({ ...product, quantity: 1 });
    }

    return { products };
  }),
  on(clearProduct, (state, { id }) => ({
    products: state.products.filter((product: Product) => product.id !== id),
  })),

  on(removeProduct, (state, { id }) => {
    const products = [...state.products];

    const productIndex = products.findIndex(
      (cartProduct: Product) => cartProduct.id === id
    );

    if (productIndex >= 0) {
      if (products[productIndex].quantity > 1) {
        products[productIndex] = {
          ...products[productIndex],
          quantity: products[productIndex].quantity - 1,
        };
      } else {
        products.splice(productIndex, 1);
      }
    }

    return { products };
  }),
  on(clear, () => ({ products: [] }))
);
