import * as Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/infra/database/prisma.module';
import { RabbitMqModule } from '@/infra/messaging/rabbitmq/rabbitmq.module';
import { OrdersController } from '@/presentation/controllers/orders.controller';
import { AppService } from '@/app.service';
import { OrdersRepository } from '@/domain/contracts/repositories/orders.repository';
import { PrismaOrdersRepository } from '@/infra/repositories/orders.repository';
import { ProductsRepository } from '@/domain/contracts/repositories/products.repository';
import {
  CreateOrderUseCase,
  CreateOrderUseCaseImpl,
} from '@/application/usecases/create-order.usecase';
import {
  OrderService,
  OrderServiceImpl,
} from '@/domain/services/orders.service';
import { PrismaProductsRepository } from '@/infra/repositories/products.repository';
import { PrismaService } from '@/infra/database/prisma.service';
import {
  UpdateOrderUseCase,
  UpdateOrderUseCaseImpl,
} from '@/application/usecases/update-order.usecase';
import {
  FindManyOrdersUseCase,
  FindManyOrdersUseCaseImpl,
} from '@/application/usecases/find-many-orders.usecase';
import {
  MarkOrderAsPaidUseCase,
  MarkOrderAsPaidUseCaseImpl,
} from '@/application/usecases/mark-order-as-paid.usecase';
import {
  FindManyProductsUseCase,
  FindManyProductsUseCaseImpl,
} from '@/application/usecases/find-many-products.usecase';
import { ProductsController } from '@/presentation/controllers/products.controller';

@Module({
  imports: [
    RabbitMqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().port().required(),
        RABBITMQ_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    PrismaModule,
  ],
  controllers: [OrdersController, ProductsController],
  providers: [
    OrdersController,
    AppService,
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: OrderService,
      useClass: OrderServiceImpl,
    },
    {
      provide: FindManyOrdersUseCase,
      useClass: FindManyOrdersUseCaseImpl,
    },
    {
      provide: CreateOrderUseCase,
      useClass: CreateOrderUseCaseImpl,
    },
    {
      provide: UpdateOrderUseCase,
      useClass: UpdateOrderUseCaseImpl,
    },
    {
      provide: MarkOrderAsPaidUseCase,
      useClass: MarkOrderAsPaidUseCaseImpl,
    },
    {
      provide: FindManyProductsUseCase,
      useClass: FindManyProductsUseCaseImpl,
    },
  ],
})
export class AppModule {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly prismaService: PrismaService,
  ) {}
  async onModuleInit() {
    // const products = [
    //   {
    //     name: 'Mouse logitech',
    //     price: 250,
    //   },
    // ];
    // for (const product of products) {
    //   const uuid = uuidv4();
    //   const upsertedProduct = await this.prismaService.product.upsert({
    //     where: {
    //       id: uuid,
    //     },
    //     update: {},
    //     create: {
    //       name: product.name,
    //       price: product.price,
    //     },
    //   });
    // }
  }
}
