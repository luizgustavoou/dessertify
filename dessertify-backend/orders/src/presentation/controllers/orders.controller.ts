import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from '@/app.service';
import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { CustomerCreatedDto } from '@/presentation/dtos/customer-created.dto';

@Controller()
export class OrdersController {
  constructor(private readonly appService: AppService) {}

  @RabbitSubscribe({
    exchange: 'customers-topic-exchange',
    routingKey: 'customers.created',
    queue: 'orders',
  })
  // @UsePipes(ValidationPipe)
  public async customerCreatedEventHandler(@RabbitPayload() message: CustomerCreatedDto) {
    console.log(`Received message: ${JSON.stringify(message)}`);
    console.log(typeof message)
    console.log(message instanceof CustomerCreatedDto)
  }
}
