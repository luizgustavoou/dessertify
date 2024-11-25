import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/infra/database/prisma.module';
import { RabbitMqModule } from '@/infra/messaging/rabbitmq/rabbitmq.module';
import { OrdersController } from '@/presentation/controllers/orders.controller';
import { AppService } from '@/app.service';
import { OrdersRepository } from '@/domain/contracts/repositories/orders.repository';
import { PrismaOrdersRepository } from '@/infra/repositories/orders.repository';

@Module({
  imports: [
    RabbitMqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().port().required(),
        RABBITMQ_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    PrismaModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersController,
    AppService,
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
  ],
})
export class AppModule {}
