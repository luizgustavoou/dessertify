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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { OrdersApi } from '@/infra/http/orders/orders.api';
import { OrderReviewComponent } from '../order-review/order-review.component';
import { ConfirmOrderComponent } from '../confirm-order-component/confirm-order.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-order-checkout',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MaterialModule,
    OrderReviewComponent,
    PaymentFormComponent,
    ConfirmOrderComponent,
  ],
  templateUrl: './order-checkout.component.html',
  styleUrl: './order-checkout.component.scss',
})
export class OrderCheckoutComponent {
  stage = 0;

  private _formBuilder = inject(FormBuilder);

  addressForm = this._formBuilder.group({
    zipcode: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    city: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    neighborhood: ['', Validators.required],
    complement: [''],
    reference: [''],
  });

  paymentElementForm = this._formBuilder.group({
    // name: ['Luiz', [Validators.required]],
    // email: ['luizgustavooumbelino@gmail.com', [Validators.email]],
    // address: [''],
    // zipcode: [''],
    // city: [''],
  });

  clientSecret: string | null = null;
  loadingContinue = signal(false);

  private _snackBar = inject(MatSnackBar);
  private _store = inject(Store<AppState>);
  private readonly ordersApi = inject(OrdersApi);

  @ViewChild('templateSnackBar') template: TemplateRef<unknown> | undefined;

  cartProducts$: Observable<CartProduct[]> =
    this._store.select(selectCartProducts);

  // public data: Order = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<OrderCheckoutComponent>);

  public dialog = inject(MatDialog);

  next() {
    if (this.stage === 2) return;

    this.stage++;
  }

  back() {
    if (this.stage === 0) return;

    this.stage--;
  }

  public handleOrderReview() {
    this.next();
  }

  public handleConfirmOrderSubmit() {
    if (this.loadingContinue()) return;

    if (this.addressForm.invalid) {
      this.openSnackBar('Please fill all fields');
      return;
    }

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
          zipcode: this.addressForm.controls.zipcode.value as any,
          city: this.addressForm.controls.city.value as any,
          street: this.addressForm.controls.street.value as any,
          number: this.addressForm.controls.number.value as any,
          neighborhood: this.addressForm.controls.neighborhood.value as any,
          complement: this.addressForm.controls.complement.value as any,
          reference: this.addressForm.controls.reference.value as any,
        },
      })
      .subscribe({
        next: (order) => {
          this.clientSecret = order.clientSecret;
          this.stage = 2;
        },
        error: (error) => {
          console.log('error ', error);
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
