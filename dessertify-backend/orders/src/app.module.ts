import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/infra/database/prisma.module';
import { RabbitMqModule } from '@/infra/messaging/rabbitmq/rabbitmq.module';
import { AppController } from '@/presentation/dtos/app.controller';
import { AppService } from '@/app.service';

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
  controllers: [AppController],
  providers: [AppController, AppService],
})
export class AppModule {}
