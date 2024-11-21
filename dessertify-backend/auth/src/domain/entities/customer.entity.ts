import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';

export class CustomerEntity {
  public id: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public password: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(params: Partial<CustomerEntity>) {
    Object.assign(this, params);
  }

  public async isPasswordValid(
    password: string,
    hashProvider: HashProvider,
  ): Promise<boolean> {
    const hashPassword = await hashProvider.hash({ content: password });

    const compare = await hashProvider.compare({
      password: this.password,
      hashPassword,
    });

    return compare;
  }
}
