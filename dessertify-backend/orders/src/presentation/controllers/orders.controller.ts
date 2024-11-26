import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CustomerCreatedDto } from '@/presentation/dtos/customer-created.dto';
import { CreateOrderDto } from '@/presentation/dtos/create-order.dto';
import { CreateOrderUseCase } from '@/application/usecases/create-order.usecase';
import { UpdateOrderDto } from '@/presentation/dtos/update-order.dto';
import { UpdateOrderUseCase } from '@/application/usecases/update-order.usecase';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: 'customers-topic-exchange',
    routingKey: 'customers.created',
    queue: 'orders',
  })
  // @UsePipes(ValidationPipe)
  public async customerCreatedEventHandler(
    @RabbitPayload() message: CustomerCreatedDto,
  ) {
    console.log(`Received message: ${JSON.stringify(message)}`);
    console.log(typeof message);
    console.log(message instanceof CustomerCreatedDto);
  }

  @Post('')
  public async createOrder(@Body() createOrderDto: CreateOrderDto) {
    console.log('body ', createOrderDto);
    return await this.createOrderUseCase.execute(createOrderDto);
  }

  @Put(':id')
  public async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createOrderDto: UpdateOrderDto,
  ) {
    return await this.updateOrderUseCase.execute(id, createOrderDto);
  }
}
