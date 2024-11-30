import { Entity } from '@/domain/entities/entity';

export interface IProductProps {
  name: string;
  price: number;
}

export class ProductEntity extends Entity<IProductProps> {
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IProductProps, id?: string) {
    super(props, id);
  }

  public static create(props: IProductProps, id?: string): ProductEntity {
    const instance = new ProductEntity(props, id);

    return instance;
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
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
