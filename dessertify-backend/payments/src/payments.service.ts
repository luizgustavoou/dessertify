import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class PaymentsService {
  getHello(): string {
    return "I'm auth serviec!";
  }

  // @RabbitSubscribe({
  //   exchange: 'customers-topic-exchange',
  //   routingKey: 'customers.*',
  //   queue: 'payments',
  // })
  // public async pubSubHandler(msg: {}, amqpMsg: ConsumeMessage) {
  //   console.log(`Received message: ${JSON.stringify(msg)}`);
  //   console.log('amqpMsg ', amqpMsg);
  // }
}
