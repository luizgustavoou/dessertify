import { StripeService } from '@/infra/payments/stripe/stripe.service';
export declare class PaymentsService {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    getHello(): string;
}
