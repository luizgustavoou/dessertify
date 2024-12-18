import { CustomerEntity } from '@/domain/entities/customer.entity';
import {
  AuthRepository,
  TFindOneCustomerByEmailParams,
} from '@/domain/contracts/repositories/auth.repository';
import { PrismaService } from '@/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createCustomer(params: CustomerEntity): Promise<CustomerEntity> {
    const newCustomer = await this.prismaService.customer.upsert({
      create: {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        customerAuth: {
          create: {
            password: params.password,
            registerType: params.registerType as any,
          },
        },
      },
      update: {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        customerAuth: {
          update: {
            password: params.password,
            registerType: params.registerType as any,
          },
        },
      },
      where: {
        id: params.id,
      },
      include: {
        customerAuth: true,
      },
    });

    return CustomerEntity.create({
      ...newCustomer,
      password: newCustomer.customerAuth.password,
    });
  }

  async findOneCustomerByEmail(
    params: TFindOneCustomerByEmailParams,
  ): Promise<CustomerEntity | null> {
    const customer = await this.prismaService.customer.findUnique({
      where: {
        email: params.email,
      },
      include: {
        customerAuth: true,
      },
    });

    return (
      customer &&
      CustomerEntity.create({
        ...customer,
        password: customer.customerAuth.password,
        registerType: customer.customerAuth.registerType,
      })
    );
  }
}
