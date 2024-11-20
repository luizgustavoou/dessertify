import { CustomerEntity } from '@/domain/entities/customer.entity';
import {
  AuthRepository,
  ICreateCustomerParams,
  TFindOneCustomerByEmailParams,
} from '@/domain/repositories/auth.repository';
import { PrismaService } from '@/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createCustomer(params: ICreateCustomerParams): Promise<CustomerEntity> {
    const newCustomer = await this.prismaService.customer.create({
      data: {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        customerAuth: {
          create: {
            password: params.password,
          },
        },
      },
      include: {
        customerAuth: true,
      },
    });

    return {
      ...newCustomer,
      password: newCustomer.customerAuth.password,
    };
  }

  async findOneCustomerByEmail(
    params: TFindOneCustomerByEmailParams,
  ): Promise<CustomerEntity> {
    const customer = await this.prismaService.customer.findUnique({
      where: {
        email: params.email,
      },
      include: {
        customerAuth: true,
      },
    });

    if (!customer) {
      return null;
    }

    return {
      ...customer,
      password: customer?.customerAuth?.password,
    };
  }
}