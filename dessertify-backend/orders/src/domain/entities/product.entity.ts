import { Entity } from '@/domain/entities/entity';
import { UnprocessableEntityException } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

export interface IProductProps {
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRawProduct {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductEntity extends Entity {
  private _name: string;
  private _price: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IProductProps, id: string) {
    super(id);
    this.name = props.name;
    this.price = props.price;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(
    props: Optional<IProductProps, 'createdAt' | 'updatedAt'>,
  ): ProductEntity {
    const id = uuidv4();

    const createdAt = props.createdAt || new Date();
    const updatedAt = props.updatedAt || new Date();

    const instance = new ProductEntity({ ...props, createdAt, updatedAt }, id);

    return instance;
  }

  public update(props: Partial<IProductProps>): void {
    if (props.name) this.name = props.name;
    if (props.price) this.price = props.price;
    
    this.updatedAt = new Date();
  }

  public raw(): IRawProduct {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set name(name: string) {
    if (name.length < 3) {
      throw new UnprocessableEntityException(
        'Product name must have at least 3 characters',
      );
    }

    this._name = name;
  }

  set price(price: number) {
    if (price <= 0) {
      throw new UnprocessableEntityException(
        'Product price must be greater than 0',
      );
    }

    this._price = price;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }
}
