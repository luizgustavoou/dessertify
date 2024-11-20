import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class PaymentsController {
  @EventPattern('user_created')
  getHello(@Payload() data: any) {
    console.log('reeccbi: ', data);
  }
}