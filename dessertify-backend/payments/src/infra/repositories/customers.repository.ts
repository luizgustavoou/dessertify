import { ICustomerProps, CustomerEntity } from '@/domain/entities';
import {} from '@/domain/repositories';
import { CustomersRepository } from '@/domain/repositories/customers.repository';
import { PrismaService } from '@/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(props: CustomerEntity): Promise<CustomerEntity> {
    const customer = await this.prismaService.customer.upsert({
      create: {
        email: props.email,
        firstName: props.firstName,
        lastName: props.lastName,
        authCustomerId: props.authCustomerId,
      },
      update: {
        email: props.email,
        firstName: props.firstName,
        lastName: props.lastName,
        authCustomerId: props.authCustomerId,
      },
      where: {
        email: props.id,
      },
    });

    return customer && CustomerEntity.create(customer);
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.prismaService.customer.findUnique({
      where: {
        id,
      },
    });

    return customer && CustomerEntity.create(customer);
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const customer = await this.prismaService.customer.findUnique({
      where: {
        email,
      },
    });

    return customer && CustomerEntity.create(customer);
  }
}
