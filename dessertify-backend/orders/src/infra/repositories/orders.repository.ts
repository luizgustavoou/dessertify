import { OrderEntity } from '@/domain/entities/order.entity';
import { PrismaService } from '@/infra/database/prisma.service';

import {
  OrdersRepository,
  TCreateOrderParams,
  TDeleteOrderParams,
  TFindManyOrdersParams,
  TUpdateOrderParams,
} from '@/domain/contracts/repositories/orders.repository';
import { OrderFactory } from '../factories/order.factory';

export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyOrders(params: TFindManyOrdersParams): Promise<OrderEntity[]> {
    const orders = await this.prismaService.order.findMany({
      skip: params.filter.skip,
      take: params.filter.take,
      where: {
        customerId: params.filter.customerId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map((order) => OrderFactory.createFromPrisma(order));
  }

  async createOrder(params: TCreateOrderParams): Promise<OrderEntity> {
    const order = await this.prismaService.order.create({
      data: {
        customerId: params.customerId,
        status: 'PENDING',
        items: {
          createMany: {
            data: params.items,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return OrderFactory.createFromPrisma(order);
  }

  async updateOrder(params: TUpdateOrderParams): Promise<OrderEntity> {
    // TODO: Ver como implementar
    return null;
  }

  async deleteOrder(params: TDeleteOrderParams): Promise<OrderEntity | null> {
    const orderDeleted = await this.prismaService.order.delete({
      where: {
        id: params.orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return OrderFactory.createFromPrisma(orderDeleted);
  }
}
