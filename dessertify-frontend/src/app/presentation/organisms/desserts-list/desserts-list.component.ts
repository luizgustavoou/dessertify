import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartProduct, Product } from '../../../domain/models/products';
import { ProductsApi } from '../../../infra/http/products/products.api';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { AppState } from '../../../application/state/app.state';
import { selectCartProducts } from '../../../application/state/selectors/cart.selector';
import {
  addProduct,
  removeProduct,
} from '../../../application/state/actions/cart.action';
import { CartItemComponent } from '../../molecules/cart-item/cart-item.component';
import { CartItemSkeletonComponent } from '../../molecules/cart-item-skeleton/cart-item-skeleton.component';
import { MaterialModule } from '../../../shared/material.module';

interface RequestState<T = unknown> {
  loading: boolean;
  error?: Error | null;
  data?: T;
}

@Component({
  selector: 'app-desserts-list',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    CartItemComponent,
    CartItemSkeletonComponent,
  ],
  templateUrl: './desserts-list.component.html',
  styleUrl: './desserts-list.component.scss',
})
export class DessertsListComponent {
  cartProducts$: Observable<CartProduct[]>;

  products$!: Observable<RequestState<Product[]>>;

  constructor(
    private readonly productsApi: ProductsApi,
    private store: Store<AppState>
  ) {
    this.cartProducts$ = this.store.select(selectCartProducts);
  }

  ngOnInit() {
    this.products$ = this.productsApi.getProducts().pipe(
      map((products) => ({
        loading: false,
        data: products,
        error: null,
      })),
      startWith({ loading: true, error: null, data: [] }),
      catchError((error) => {
        return of({ loading: false, error, data: [] });
      })
    );
  }

  productInCart(id: string): Observable<CartProduct | undefined> {
    return this.cartProducts$.pipe(
      map((cartProducts) =>
        cartProducts.find((cartProduct) => cartProduct.id === id)
      )
    );
  }

  handleAddProduct(event: MouseEvent, product: Product) {
    this.store.dispatch(addProduct({ product }));
  }

  handleRemoveProduct(event: MouseEvent, product: Product) {
    this.store.dispatch(removeProduct({ id: product.id }));
  }
}
