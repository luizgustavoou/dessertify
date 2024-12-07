import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('webhooks-stripe/payments-intents')
export class PaymentsIntentsStripeWebhook {
  @Post('succeeded')
  paymentsIntent(@Body() body: any) {
    console.log('[PAYMENTS INTENTS STRIPE WEBHOOK - Succeeded]')
    
    console.log('body ', body);
  }
}
