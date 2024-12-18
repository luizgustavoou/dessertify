import { CreateOrderDto } from '@/presentation/dtos/create-order.dto';
import {
  OrderEntity,
  OrderStatus,
  IRawOrder,
} from '@/domain/entities/order.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from '@/domain/contracts/repositories/orders.repository';
import { ProductsRepository } from '@/domain/contracts/repositories/products.repository';
import { UpdateOrderDto } from '@/presentation/dtos/update-order.dto';
import { FindManyOrdersQueryDto } from '@/presentation/dtos/find-many-orders.dto';

export abstract class OrderService {
  abstract createOrder(params: CreateOrderDto): Promise<IRawOrder>;
  abstract updateOrder(id: string, params: UpdateOrderDto): Promise<IRawOrder>;
  abstract findManyOrders(params: FindManyOrdersQueryDto): Promise<IRawOrder[]>;
}

@Injectable()
export class OrderServiceImpl implements OrderService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async updateOrder(id: string, params: UpdateOrderDto): Promise<IRawOrder> {
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
          productId: item.productId,
          quantity: item.quantity,
        };
      }),
    );

    order.items = itemsWithDomainProduct;

    await this.ordersRepository.saveOrder(order);

    return order.raw();
  }

  async createOrder(params: CreateOrderDto): Promise<IRawOrder> {
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
      status: OrderStatus.PENDING,
      items: itemsWithDomainProduct.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
    });

    const savedOrder = await this.ordersRepository.saveOrder(order);

    return savedOrder.raw();
  }

  async findManyOrders(params: FindManyOrdersQueryDto): Promise<IRawOrder[]> {
    const orders = await this.ordersRepository.findManyOrders(params);

    return orders.map((order) => order.raw());
  }
}
