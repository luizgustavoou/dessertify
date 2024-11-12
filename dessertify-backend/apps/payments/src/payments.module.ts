import { Module } from '@nestjs/common';
import { PaymentsController } from '@app/payments/payments.controller';
import { PaymentsService } from '@app/payments/payments.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
