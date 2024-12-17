import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export type CreatePaymentIntentParams = {
  amount: number;
  orderId: string;
};

export type AttachPaymentMethodToCustomerParams = {
  paymentMethodId: string;
  stripeCustomerId: string;
};

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const STRIPE_SECRET_KEY =
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');

    this.stripe = new Stripe(STRIPE_SECRET_KEY);
  }

  public async createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<Stripe.PaymentIntent> {
    // JEITO 1:
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // });

    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   payment_method: paymentMethod.id,
    //   amount: params.amount,
    //   confirm: true,
    //   currency: 'brl',
    //   metadata: {
    //     order_id: params.orderId,
    //   },
    // });

    // JEITO 2:

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: params.amount,
      confirm: true,
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
      currency: 'brl',
      metadata: {
        order_id: params.orderId,
      },
    });

    return paymentIntent;
  }

  public async attachPaymentMethodToCustomer(
    params: AttachPaymentMethodToCustomerParams,
  ): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    const paymentMethodAtached = await this.stripe.paymentMethods.attach(
      params.paymentMethodId,
      {
        customer: params.stripeCustomerId,
      },
    );

    return paymentMethodAtached;
  }

  public async createCustomer(params: {
    id: string;
    email: string;
    name: string;
  }): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: {
        customer_id: params.id,
      },
    });

    return customer;
  }
}
