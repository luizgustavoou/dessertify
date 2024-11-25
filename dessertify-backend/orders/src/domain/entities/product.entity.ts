export class ProductEntity {
  public id: string;
  public name: string;
  public price: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(params: Partial<ProductEntity>) {
    Object.assign(this, params);
  }
}
