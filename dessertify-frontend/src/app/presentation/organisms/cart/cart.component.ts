import { Store } from '@ngrx/store';
import { Observable, lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';


import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConcludeOrderComponent } from '../conclude-order/conclude-order.component';
import { MaterialModule } from '@/shared/material.module';
import { AppButtonComponent } from '@/presentation/atoms/app-button/app-button.component';
import { SeparatorComponent } from '@/presentation/atoms/separator/separator.component';
import { CartProduct, Product } from '@/domain/models/products';
import { AppState } from '@/application/state/app.state';
import { selectCartProducts, selectCartTotal } from '@/application/state/selectors/cart.selector';
import { clearProduct } from '@/application/state/actions/cart.action';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ConcludeOrderComponent,
    CommonModule,
    AppButtonComponent,
    MaterialModule,
    SeparatorComponent
],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartProducts$: Observable<CartProduct[]>;
  cartProductsLength$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.cartProducts$ = this.store.select(selectCartProducts);
    this.cartProductsLength$ = this.store.select(selectCartTotal);
  }

  public dialog = inject(MatDialog);

  openDialog() {
    const products = lastValueFrom(this.cartProducts$);

    this.dialog.open(ConcludeOrderComponent, {
      data: {
        products,
      },
      width: '600px',
      maxWidth: '100vw',
      height: '600px',
    });
  }

  handleRemoveProduct(product: Product) {
    this.store.dispatch(clearProduct({ id: product.id }));
  }

  getTotal(): number {
    let total = 0;
    this.cartProducts$.subscribe((products) => {
      total = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
    });
    return total;
  }
}
