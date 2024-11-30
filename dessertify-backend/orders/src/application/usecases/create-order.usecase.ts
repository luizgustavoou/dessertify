import { RawOrder } from '@/domain/entities/order.entity';
import { CreateChargeEvent } from '@/domain/events/create-charge.event';
import { OrderService } from '@/domain/services/orders.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CardDetails } from '@/domain/events/create-charge.event';

export abstract class CreateOrderUseCase {
  abstract execute(params: TCreateOrderUseCaseParams): Promise<RawOrder>;
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

  async execute(params: TCreateOrderUseCaseParams): Promise<RawOrder> {
    const order = await this.orderService.createOrder(params);

    const cardDetails = new CardDetails('123', '4242424242424242');

    const createChargeEvent = new CreateChargeEvent(
      cardDetails,
      order.items.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0,
      ),
      'luiz@gmail.com',
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
