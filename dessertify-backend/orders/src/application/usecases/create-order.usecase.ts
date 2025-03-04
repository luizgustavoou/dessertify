import { IRawOrder, OrderEntity } from '@/domain/entities/order.entity';
import { CreateChargeEvent } from '@/domain/events/create-charge.event';
import { OrderService } from '@/domain/services';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CardDetails } from '@/domain/events/create-charge.event';
import { ProductsRepository } from '@/domain/contracts/repositories/products.repository';
import { OrdersRepository } from '@/domain/contracts/repositories/orders.repository';

export abstract class CreateOrderUseCase {
  abstract execute(params: TCreateOrderUseCaseParams): Promise<IRawOrder>;
}

export type TCreateOrderUseCaseParams = {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryAddress: {
    zipcode: string;
    city: string;
    street: string;
    number: number;
    neighborhood: string;
    complement: string;
    reference: string;
  };
};

@Injectable()
export class CreateOrderUseCaseImpl implements CreateOrderUseCase {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly productsRepository: ProductsRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async execute(params: TCreateOrderUseCaseParams): Promise<IRawOrder> {
    try {
      const itemsWithDomainProduct = await Promise.all(
        params.items.map(async (item) => {
          const product = await this.productsRepository.findOneById({
            id: item.productId,
          });

          if (!product) {
            throw new NotFoundException('Product not found');
          }

          return {
            product: product,
            quantity: item.quantity,
          };
        }),
      );

      const order = OrderEntity.create({
        customerId: params.customerId,
        paid: false,
        items: itemsWithDomainProduct.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          productPrice: item.product.price,
          // TODO: Ver se utiliza o OrderItemEntity
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        deliveryAddress: params.deliveryAddress,
        clientSecret: null,
      });

      // const cardDetails = new CardDetails('123', '4242424242424242');

      const createChargeEvent = new CreateChargeEvent(
        // cardDetails,
        order.total,
        order.customerId,
        order.id,
      );

      const res = await this.amqpConnection.request<{ client_secret: string }>({
        exchange: 'orders-topic-exchange',
        routingKey: 'orders.created',
        payload: createChargeEvent,
      });

      order.clientSecret = res.client_secret;

      const savedOrder = await this.ordersRepository.saveOrder(order);

      return savedOrder.raw();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error creating order. Cause: ' + error.message,
      );
    }
  }
}
