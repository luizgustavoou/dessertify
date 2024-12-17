import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CustomerCreatedDto } from '@/presentation/dtos/customer-created.dto';
import { CreateOrderDto } from '@/presentation/dtos/create-order.dto';
import { CreateOrderUseCase } from '@/application/usecases/create-order.usecase';
import { UpdateOrderDto } from '@/presentation/dtos/update-order.dto';
import { UpdateOrderUseCase } from '@/application/usecases/update-order.usecase';
import { FindManyOrdersQueryDto } from '@/presentation/dtos/find-many-orders.dto';
import { FindManyOrdersUseCase } from '@/application/usecases/find-many-orders.usecase';
import {
  SortingParam,
  SortingParams,
} from '@/core/decorators/sorting-params.decorator';
import { PaidOrderDto } from '@/presentation/dtos/paid-order.dto';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly findManyOrdersUseCase: FindManyOrdersUseCase,
  ) {}

  // @RabbitSubscribe({
  //   exchange: 'customers-topic-exchange',
  //   routingKey: 'customers.created',
  //   queue: 'orders',
  // })
  // // @UsePipes(ValidationPipe)
  // public async customerCreatedEventHandler(
  //   @RabbitPayload() message: CustomerCreatedDto,
  // ) {
  //   console.log(`Received message: ${JSON.stringify(message)}`);
  //   console.log(typeof message);
  //   console.log(message instanceof CustomerCreatedDto);
  // }

  @Post('')
  public async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.createOrderUseCase.execute(createOrderDto);
  }

  @Put(':id')
  public async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createOrderDto: UpdateOrderDto,
  ) {
    return await this.updateOrderUseCase.execute(id, createOrderDto);
  }

  @Get('')
  public async findMany(
    @Query() findManyOrdersQueryDto: FindManyOrdersQueryDto,
    @SortingParams(['name', 'createdAt', 'updatedAt'])
    sort?: SortingParam,
  ) {
    return await this.findManyOrdersUseCase.execute(findManyOrdersQueryDto);
  }

  @RabbitSubscribe({
    exchange: 'payments-topic-exchange',
    routingKey: 'orders.paid',
    queue: 'payments.order_paid',
  })
  public async orderPaidEventHandler(@RabbitPayload() msg: PaidOrderDto) {
    console.log('[orderPaidEventHandler]');
    console.log('Received message: ', msg);
  }
}
