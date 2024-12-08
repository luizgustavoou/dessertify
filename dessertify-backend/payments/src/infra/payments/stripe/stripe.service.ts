import { Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  public async createPaymentIntent(
    amount: number,
  ): Promise<Stripe.PaymentIntent> {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // });

    const paymentIntent = await this.stripe.paymentIntents.create({
      // payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
      currency: 'brl',
    });

    return paymentIntent;
  }

  public async createCustomer(params: {
    id: string;
    email: string;
  }): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email: params.email,
      metadata: {
        customer_id: params.id,
      },
    });

    return customer;
  }
}
