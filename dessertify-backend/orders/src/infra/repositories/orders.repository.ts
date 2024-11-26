import { OrderEntity } from '@/domain/entities/order.entity';
import { PrismaService } from '@/infra/database/prisma.service';

import {
  OrdersRepository,
  TDeleteOrderParams,
  TFindManyOrdersParams,
} from '@/domain/contracts/repositories/orders.repository';
import { OrderFactory } from '@/infra/factories/order.factory';
import { Injectable } from '@nestjs/common';
@Injectable()
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

    return orders.map((order) => OrderFactory.toDomain(order));
  }

  async saveOrder(params: OrderEntity): Promise<OrderEntity> {
    const order = await this.prismaService.order.upsert({
      where: {
        id: params.id,
      },
      update: {
        customerId: params.customerId,
        status: params.status as any,
        items: {
          createMany: {
            data: params.items,
          },
        },
      },
      create: {
        customerId: params.customerId,
        status: params.status as any,
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

    return OrderFactory.toDomain(order);
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

    return OrderFactory.toDomain(orderDeleted);
  }
}
