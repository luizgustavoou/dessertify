import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from '@app/payments/payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }
}
