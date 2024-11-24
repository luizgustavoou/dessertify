import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

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
    queue: 'payments',
  })
  public async customerCreatedEventHandler(msg: {}, amqpMsg: ConsumeMessage) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
    console.log('amqpMsg ', amqpMsg);
  }
}
