import { Store } from '@ngrx/store';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderCheckoutComponent } from '@/presentation/organisms/order-checkout/order-checkout.component';
import { MaterialModule } from '@/shared/material.module';
import { SeparatorComponent } from '@/presentation/atoms/separator/separator.component';
import { CartProduct, Product } from '@/domain/models/products';
import { AppState } from '@/application/state/app.state';
import {
  selectCartProducts,
  selectCartTotal,
} from '@/application/state/selectors/cart.selector';
import { clearProduct } from '@/application/state/actions/cart.action';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, MaterialModule, SeparatorComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartProducts$: Observable<CartProduct[]>;
  cartProductsLength$: Observable<number>;
  dialog = inject(MatDialog);
  breakpointObserver = inject(BreakpointObserver);

  constructor(private store: Store<AppState>) {
    this.cartProducts$ = this.store.select(selectCartProducts);
    this.cartProductsLength$ = this.store.select(selectCartTotal);
  }

  async openDialog() {
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(OrderCheckoutComponent, {
      width: '600px',
      maxWidth: isMobile ? '100vw' : '80vw',
      height: '600px',
      position: isMobile ? { bottom: '0%' } : undefined,
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
