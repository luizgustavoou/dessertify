import { Module } from '@nestjs/common';
import { StripeService } from '@/infra/payments/stripe/stripe.service';

@Module({
  imports: [],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
