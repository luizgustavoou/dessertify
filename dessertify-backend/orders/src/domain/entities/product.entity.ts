import { Entity } from '@/domain/entities/entity';
import { UnprocessableEntityException } from '@nestjs/common';

export interface IProductProps {
  id?: string;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRawProduct {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export class ProductEntity extends Entity<IProductProps> {
  constructor({ id, ...props }: IProductProps) {
    if (props.name.length < 3) {
      throw new UnprocessableEntityException(
        'Product name must have at least 3 characters',
      );
    }
    if (props.price <= 0) {
      throw new UnprocessableEntityException(
        'Product price must be greater than 0',
      );
    }

    super(props, id);
  }

  public static create(props: IProductProps): ProductEntity {
    const instance = new ProductEntity(props);

    return instance;
  }

  public raw(): IRawProduct {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get price(): number {
    return this.props.price;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
