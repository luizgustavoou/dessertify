import { Module } from '@nestjs/common';
import { PaymentsController } from '@app/payments/payments.controller';
import { PaymentsService } from '@app/payments/payments.service';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
