import { OrderItemEntity } from '@/domain/entities/order-item.entity';
import { OrderEntity } from '@/domain/entities/order.entity';
import { ProductEntity } from '@/domain/entities/product.entity';

export class OrderFactory {
  static createFromPrisma(order: any): OrderEntity {
    const items = order.items.map((item) => {
      const product = new ProductEntity({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });

      return new OrderItemEntity({
        id: item.id,
        orderId: item.orderId,
        product: product,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    });

    const orderFormatted = new OrderEntity({
      id: order.id,
      items: items,
      createdAt: order.createdAt,
      status: order.status,
      updatedAt: order.updatedAt,
    });

    return orderFormatted;
  }
}
