import { ConsumeMessage } from 'amqplib';
import { CreateChargeDto } from '@/presentation/dtos/create-charge.dto';
import { StripeService } from '@/infra/payments/stripe/stripe.service';
export declare class PaymentsController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    testeStripe(): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.PaymentIntent>>;
    customerCreatedEventHandler(msg: {}, amqpMsg: ConsumeMessage): Promise<void>;
    orderCreatedEventHandler(msg: CreateChargeDto): Promise<void>;
}
