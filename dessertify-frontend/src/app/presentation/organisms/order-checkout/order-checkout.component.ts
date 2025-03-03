import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartProduct } from '@/domain/models/products';
import { MaterialModule } from '@/shared/material.module';
import { AppState } from '@/application/state/app.state';
import { selectCartProducts } from '@/application/state/selectors/cart.selector';

import { PizzaPartyAnnotatedComponent } from '@/presentation/molecules/pizza-party-annotated/pizza-party-annotated.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { OrdersApi } from '@/infra/http/orders/orders.api';
import { OrderReviewComponent } from '../order-review/order-review.component';
import { AddressFormComponent } from '../addres-form-component/addres-form.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'app-order-checkout',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MaterialModule,
    OrderReviewComponent,
    AddressFormComponent,
    PaymentFormComponent,
  ],
  templateUrl: './order-checkout.component.html',
  styleUrl: './order-checkout.component.scss',
})
export class OrderCheckoutComponent {
  clientSecret: string | null = null;
  loadingContinue = signal(false);

  stage = 0;

  private _snackBar = inject(MatSnackBar);
  private _store = inject(Store<AppState>);
  private readonly ordersApi = inject(OrdersApi);


  @ViewChild('templateSnackBar') template: TemplateRef<unknown> | undefined;

  cartProducts$: Observable<CartProduct[]> =
    this._store.select(selectCartProducts);

  // public data: Order = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<OrderCheckoutComponent>);

  public dialog = inject(MatDialog);

  public handleOrderReview() {
    this.stage++;
  }

  public handleAddressFormSubmit(formValue: any) {
    if (this.loadingContinue()) return;

    this.loadingContinue.set(true);

    this.ordersApi
      .createOrder({
        customerId: '5ba0b782-a2a2-4757-b3d6-64be6f2b22ee',
        items: [
          {
            productId: 'dd013896-8531-4c30-9ebd-097133145c99',
            quantity: 1,
          },
        ],
        deliveryAddress: {
          country: formValue.country,
          state: formValue.state,
          city: formValue.city,
          street: formValue.street,
          number: formValue.number,
          zipcode: formValue.zipcode,
        },
      })
      .subscribe({
        next: (order) => {
          this.clientSecret = order.clientSecret;
          this.stage = 2;
        },
        error: (error) => {
          const message =
            error.error.message instanceof Array
              ? error.error.message[0]
              : error.error.message;

          this.openSnackBar(`Error creating order. Cause: ${message}`);
        },
        complete: () => {
          this.loadingContinue.set(false);
        },
      });
  }

  public handlePaymentFormSubmit() {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    // this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
    //   duration: 1000,
    // });
    // this._snackBar.openFromTemplate(this.template!, {});
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
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
