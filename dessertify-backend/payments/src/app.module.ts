import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PaymentsController } from '@/presentation/controllers/payments.controller';
import { PaymentsService } from '@/payments.service';
import { PrismaModule } from '@/infra/database/prisma.module';
import { RabbitMqModule } from '@/infra/messaging/rabbitmq/rabbitmq.module';
import { StripeModule } from '@/infra/payments/stripe/stripe.module';
import { PaymentsIntentsStripeWebhook } from '@/presentation/controllers/webhooks/stripe/payments-intent-stripe-webhook.controller';

@Module({
  imports: [
    StripeModule,
    RabbitMqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        HTTP_PORT: Joi.number().port().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
  ],
  controllers: [PaymentsController, PaymentsIntentsStripeWebhook],
  providers: [PaymentsService, PrismaModule, PaymentsController], // É necessário colocar o PaymentsController em providers para conseguir escutar as mensagens do RabbitMQ
})
export class AppModule {}
