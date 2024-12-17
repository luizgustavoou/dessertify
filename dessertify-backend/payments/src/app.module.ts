import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PaymentsService } from '@/payments.service';
import { PrismaModule } from '@/infra/database/prisma.module';
import { RabbitMqModule } from '@/infra/messaging/rabbitmq/rabbitmq.module';
import { StripeModule } from '@/infra/payments/stripe/stripe.module';
import {
  PaymentsIntentsStripeWebhook,
  PaymentsController,
} from '@/presentation/controllers';
import {
  CreateCustomerUseCase,
  CreateCustomerUseCaseImpl,
} from '@/application/usecases';
import { CustomersService, CustomersServiceImpl } from '@/domain/services';
import { PrismaCustomersRepository } from '@/infra/repositories';
import { CustomersRepository } from '@/domain/repositories';
import { ProcessOrderUseCase, ProcessOrderUseCaseImpl } from '@/application/usecases/process-order.usecase';

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
    PrismaModule,
  ],
  controllers: [PaymentsController, PaymentsIntentsStripeWebhook],
  providers: [
    PaymentsService,
    PaymentsController,
    { provide: CreateCustomerUseCase, useClass: CreateCustomerUseCaseImpl },
    {
      provide: CustomersService,
      useClass: CustomersServiceImpl,
    },
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
    {
      provide: ProcessOrderUseCase,
      useClass: ProcessOrderUseCaseImpl,
    }
  ], // É necessário colocar o PaymentsController em providers para conseguir escutar as mensagens do RabbitMQ
})
export class AppModule {}
