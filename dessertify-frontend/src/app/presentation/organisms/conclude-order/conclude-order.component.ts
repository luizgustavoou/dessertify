import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { CartProduct, Product } from '@/domain/models/products';
import { SeparatorComponent } from '@/presentation/atoms/separator/separator.component';
import { MaterialModule } from '@/shared/material.module';
import { AppState } from '@/application/state/app.state';
import { selectCartProducts } from '@/application/state/selectors/cart.selector';
import { clear } from '@/application/state/actions/cart.action';

import { PizzaPartyAnnotatedComponent } from '@/presentation/molecules/pizza-party-annotated/pizza-party-annotated.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import { OrdersApi } from '@/infra/http/orders/orders.api';
import {
  StripeElementsOptions,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-conclude-order',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SeparatorComponent,
    ReactiveFormsModule,
    MatInputModule,
    StripeElementsDirective,
    StripePaymentElementComponent,
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './conclude-order.component.html',
  styleUrl: './conclude-order.component.scss',
})
export class ConcludeOrderComponent {
  loadingContinue = signal(false);

  stage = 0;

  private _snackBar = inject(MatSnackBar);
  private _store = inject(Store<AppState>);

  @ViewChild('templateSnackBar') template: TemplateRef<unknown> | undefined;

  cartProducts$: Observable<CartProduct[]> =
    this._store.select(selectCartProducts);

  // public data: Order = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<ConcludeOrderComponent>);

  public dialog = inject(MatDialog);

  openSnackBar(message: string) {
    // this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
    //   duration: 1000,
    // });
    // this._snackBar.openFromTemplate(this.template!, {});
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  public continue() {
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
      })
      .subscribe({
        next: (order) => {
          this.elementsOptions.clientSecret = order.clientSecret;
          this.stage = 1;
        },
        error: (error) => {
          this.openSnackBar('Error creating order');
        },
        complete: () => {
          this.loadingContinue.set(false);
        },
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

  private readonly ordersApi = inject(OrdersApi);

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  stripe = injectStripe();

  private readonly fb = inject(FormBuilder);

  paying = signal(false);

  paymentElementForm = this.fb.group({
    // name: ['Luiz', [Validators.required]],
    // email: ['luizgustavooumbelino@gmail.com', [Validators.email]],
    // address: [''],
    // zipcode: [''],
    // city: [''],
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: {
      theme: 'flat',
    },
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  pay() {
    if (this.paying() || this.paymentElementForm.invalid) return;
    this.paying.set(true);

    // const { name, email, address, zipcode, city } =
    // this.paymentElementForm.getRawValue();

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          // payment_method_data: {
          //   billing_details: {
          //     name: name as string,
          //     email: email as string,
          //     address: {
          //       line1: address as string,
          //       postal_code: zipcode as string,
          //       city: city as string,
          //     },
          //   },
          // },
        },
        redirect: 'if_required',
      })
      .subscribe((result) => {
        this.paying.set(false);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert('Error: ' + result.error.message);
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            this._store.dispatch(clear());
            this.openSnackBar('Dessert order completed successfully!');
            this.dialogRef.close();
          }
        }
      });
  }
}
