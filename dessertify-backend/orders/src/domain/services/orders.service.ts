import { CreateOrderDto } from '@/presentation/dtos/create-order.dto';
import {
  OrderEntity,
  OrderStatus,
  RawOrder,
} from '@/domain/entities/order.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from '@/domain/contracts/repositories/orders.repository';
import { ProductsRepository } from '@/domain/contracts/repositories/products.repository';
import { UpdateOrderDto } from '@/presentation/dtos/update-order.dto';

export abstract class OrderService {
  abstract createOrder(params: CreateOrderDto): Promise<RawOrder>;
  abstract updateOrder(id: string, params: UpdateOrderDto): Promise<RawOrder>;
}

@Injectable()
export class OrderServiceImpl implements OrderService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async updateOrder(id: string, params: UpdateOrderDto): Promise<RawOrder> {
    const order = await this.ordersRepository.findOneById({
      id,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (params.status) {
      order.status = params.status;
    }

    if (order.customerId) {
      order.customerId = params.customerId;
    }

    order.items = params.items;

    await this.ordersRepository.saveOrder(order);

    return order.raw();
  }

  async createOrder(params: CreateOrderDto): Promise<RawOrder> {
    for (const item of params.items) {
      const product = await this.productsRepository.findOneById({
        id: item.productId,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }
    }

    const order = OrderEntity.create({
      customerId: params.customerId,
      status: OrderStatus.PENDING,
      items: params.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    const savedOrder = await this.ordersRepository.saveOrder(order);

    return savedOrder.raw();
  }
}
