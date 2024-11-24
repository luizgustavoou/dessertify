import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RabbitSubscribe({
    exchange: 'customers-topic-exchange',
    routingKey: 'customers.created',
    queue: 'orders',
  })
  public async customerCreatedEventHandler(msg: {}, amqpMsg: ConsumeMessage) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
    console.log('amqpMsg ', amqpMsg);
  }
}
