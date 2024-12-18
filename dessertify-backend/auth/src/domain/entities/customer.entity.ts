import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';
import { Entity } from '@/domain/entities/entity';

export interface ICustomerProps {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  registerType?: RegisterType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRawCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  registerType: RegisterType;
  createdAt: Date;
  updatedAt: Date;
}

export const RegisterType = {
  DEFAULT: 'DEFAULT',
  GOOGLE: 'GOOGLE',
};

export type RegisterType = (typeof RegisterType)[keyof typeof RegisterType];

export class CustomerEntity extends Entity<ICustomerProps> {
  constructor({ id, ...props }: ICustomerProps) {
    super(props, id);
    this.registerType = props.registerType || RegisterType.DEFAULT;
  }

  public static create(props: ICustomerProps): CustomerEntity {
    const entity = new CustomerEntity(props);

    return entity;
  }

  public async isPasswordValid(
    password: string,
    hashProvider: HashProvider,
  ): Promise<boolean> {
    const hashPassword = await hashProvider.hash({ content: password });

    const compare = await hashProvider.compare({
      password: this.props.password,
      hashPassword,
    });

    return compare;
  }

  public raw(): IRawCustomer {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      registerType: this.registerType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
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

  public get password(): string {
    return this.props.password;
  }

  public get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  public get registerType(): RegisterType {
    return this.props.registerType;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
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

  set registerType(registerType: RegisterType) {
    this.props.registerType = registerType;
  }
}
