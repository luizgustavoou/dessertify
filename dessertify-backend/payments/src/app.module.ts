import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import {
  ProcessOrderUseCase,
  ProcessOrderUseCaseImpl,
} from '@/application/usecases/process-order.usecase';
import amqp from 'amqp-connection-manager';
import * as amqplib from 'amqplib';

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
    },
  ], // É necessário colocar o PaymentsController em providers para conseguir escutar as mensagens do RabbitMQ
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    // this.setup();
  }

  async setup() {
    const connection = await amqplib.connect(
      this.configService.get<string>('RABBITMQ_URL'),
    );

    const main_queue = 'my_queue';
    const requeue_queue = 'requeue-queue2';
    const error_exchange = 'error-exchange2';
    const my_exchange = 'my_exchange';
    const channel = await connection.createChannel();

    await channel.assertExchange(error_exchange, 'fanout', { durable: true });
    await channel.assertExchange(my_exchange, 'topic', { durable: true });

    await channel.assertQueue(main_queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': error_exchange,
        'x-dead-letter-routing-key': '',
      },
    });

    await channel.assertQueue(requeue_queue, {
      durable: true,
      exclusive: false,
    });

    await channel.bindQueue(main_queue, my_exchange, 'my_key');
    await channel.bindQueue(requeue_queue, error_exchange, '');

    channel.consume(main_queue, async (msg) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('[my_queue] vou enviar para a DLX!');
      channel.nack(msg, false, false);
    });

    channel.consume(requeue_queue, (msg) => {

      if (msg !== null) {
        const xDeath = msg.properties.headers['x-death'];
        const originalQueue = msg.properties.headers['x-first-death-queue'];
        if (xDeath) {
          console.log('xDeath[0].count ', xDeath[0].count);
          console.log('Dead-letter reason:', xDeath[0].reason);
          console.log('Original exchange:', xDeath[0].exchange);
          console.log('Original routing key:', xDeath[0]['routing-keys']);
        }

        // channel.ack(msg);
        channel.sendToQueue(originalQueue, msg.content, msg.properties);
      }
    });

    setTimeout(() => {
      channel.publish(my_exchange, 'my_key', Buffer.from('Hello, world!'));
    }, 3000);
  }
}
