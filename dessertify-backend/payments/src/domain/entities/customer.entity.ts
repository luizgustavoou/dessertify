import { Entity } from '@/domain/entities/entity';

export interface ICustomerProps {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  authCustomerId: string;
}

export interface IRawCustomer {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  authCustomerId: string;
}

export class CustomerEntity extends Entity<ICustomerProps> {
  private constructor({ id, ...props }: ICustomerProps) {
    super(props, id);
  }

  public static create(props: ICustomerProps): CustomerEntity {
    const entity = new CustomerEntity(props);

    return entity;
  }

  public raw(): IRawCustomer {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      authCustomerId: this.authCustomerId,
    };
  }

  get id(): string {
    return this._id;
  }

  public get email(): string {
    return this.props.email;
  }

  public get firstName(): string {
    return this.props.firstName;
  }

  public get lastName(): string {
    return this.props.lastName;
  }

  public get authCustomerId(): string {
    return this.props.authCustomerId;
  }

  public get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  set email(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email');
    }

    this.props.email = email;
  }

  set firstName(firstName: string) {
    if (firstName.length < 2) {
      throw new Error('First name must be at least 2 characters long');
    }

    this.props.firstName = firstName;
  }

  set lastName(lastName: string) {
    if (lastName.length < 2) {
      throw new Error('Last name must be at least 2 characters long');
    }

    this.props.lastName = lastName;
  }
}
