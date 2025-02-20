import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';
import { OrdersApi } from '@/infra/http/orders/orders.api';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/material.module';

// import { YourOwnAPIService } from './your-own-api.service';

@Component({
  selector: 'ngstr-checkout-form',
  templateUrl: './payment-element.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    StripeElementsDirective,
    StripePaymentElementComponent,
    CommonModule,
    MaterialModule
  ],
})
export class CheckoutFormComponent implements OnInit {
  private readonly ordersApi = inject(OrdersApi);

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  stripe = injectStripe();

  private readonly fb = inject(FormBuilder);

  paying = signal(false);

  paymentElementForm = this.fb.group({
    name: ['Luiz', [Validators.required]],
    email: ['luizgustavooumbelino@gmail.com', [Validators.email]],
    address: [''],
    zipcode: [''],
    city: [''],
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

  ngOnInit() {
    this.ordersApi
      .createOrder({
        customerId: '655901ef-acc4-48c3-aaf2-ff3618aa82d5',
        items: [
          {
            productId: '99a33a04-dc04-4c63-a213-e80929514e3c',
            quantity: 1,
          },
        ],
      })
      .subscribe((order) => {
        this.elementsOptions.clientSecret = order.clientSecret;
      });
  }

  pay() {
    if (this.paying() || this.paymentElementForm.invalid) return;
    this.paying.set(true);

    const { name, email, address, zipcode, city } =
      this.paymentElementForm.getRawValue();

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                city: city as string,
              },
            },
          },
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
            // Show a success message to your customer
            alert('Payment successful!');
          }
        }
      });
  }

  collapse() {
    this.paymentElement.collapse();
  }
}
