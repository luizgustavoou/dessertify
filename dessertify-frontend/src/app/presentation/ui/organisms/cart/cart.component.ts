import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from '../../../../application/state/app.state';
import { Product, CartProduct } from '../../../../domain/models/products';
import {
  selectCartProducts,
  selectCartTotal,
} from '../../../../application/state/selectors/cart.selector';
import { MatIconModule } from '@angular/material/icon';
import { clearProduct } from '../../../../application/state/actions/cart.action';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';

import {
  Component,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
} from '@angular/material/dialog';
import { ConcludeOrderComponent } from '../conclude-order/conclude-order.component';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ConcludeOrderComponent,
    CommonModule,
    AppButtonComponent,
    MaterialModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  myContext = { $implicit: 'World', localSk: 'Svet' };

  cartProducts$: Observable<CartProduct[]>;
  cartProductsLength$: Observable<number>;

  public dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(ConcludeOrderComponent, {
      data: {
        name: 'Luiz',
      },
      width: "600px",
      maxWidth: "100vw",
    });
  }

  constructor(private store: Store<AppState>) {
    this.cartProducts$ = this.store.select(selectCartProducts);
    this.cartProductsLength$ = this.store.select(selectCartTotal);
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
