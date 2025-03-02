export interface Order {
  paid: any;
  id: string;
  customerId: string;
  items: [
    {
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
        createdAt: string;
        updatedAt: string;
      };
      productPrice: number;
      createdAt: string;
      updatedAt: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
  total: number;
  status: string;
  clientSecret: string;
}
