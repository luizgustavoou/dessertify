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

  public isPasswordValid(password: string): boolean {
    return this.password === password;
  }
}

