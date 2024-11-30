import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { CreateChargeDto } from '@/presentation/dtos/create-charge.dto';

@Controller()
export class PaymentsController {
  // @EventPattern('customer_created')
  // async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
  //   // Obtendo o canal do contexto
  //   const channel = context.getChannelRef();

  //   const originalMsg = context.getMessage();

  //   // console.log(originalMsg);
  //   console.log('pattern', context.getPattern());
  //   console.log('data ', data);
  //   console.log('originalMsg ', originalMsg);

  //   channel.ack(originalMsg);
  // }

  @RabbitSubscribe({
    exchange: 'customers-topic-exchange',
    routingKey: 'customers.created',
    queue: 'payments.customer_registration',
  })
  public async customerCreatedEventHandler(msg: {}, amqpMsg: ConsumeMessage) {
    console.log('[customerCreatedEventHandler]');
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    routingKey: 'orders.created',
    queue: 'payments.order_registration',
  })
  @UsePipes(ValidationPipe)
  // public async orderCreatedEventHandler(msg: {}, amqpMsg: ConsumeMessage) {
  public async orderCreatedEventHandler(@RabbitPayload() msg: CreateChargeDto) {
    console.log('[orderCreatedEventHandler]');
    console.log('Received message: ', msg);
  }
}
