import { IRawOrder } from '@/domain/entities/order.entity';
import { CreateChargeEvent } from '@/domain/events/create-charge.event';
import { OrderService } from '@/domain/services';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CardDetails } from '@/domain/events/create-charge.event';

export abstract class CreateOrderUseCase {
  abstract execute(params: TCreateOrderUseCaseParams): Promise<IRawOrder>;
}

export type TCreateOrderUseCaseParams = {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

@Injectable()
export class CreateOrderUseCaseImpl implements CreateOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async execute(params: TCreateOrderUseCaseParams): Promise<IRawOrder> {
    const order = await this.orderService.createOrder(params);

    // const cardDetails = new CardDetails('123', '4242424242424242');

    const createChargeEvent = new CreateChargeEvent(
      // cardDetails,
      order.total,
      order.customerId,
      order.id,
    );

    await this.amqpConnection.publish(
      'orders-topic-exchange',
      'orders.created',
      createChargeEvent,
    );

    return order;
  }
}
