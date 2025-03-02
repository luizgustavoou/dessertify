import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Order } from '@/domain/models/orders';

export type CreateOrderProps = {
  customerId: string;
  items: [
    {
      productId: string;
      quantity: number;
    }
  ];
  deliveryAddress: {
    street: string;
    number: number;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
};

export abstract class OrdersApi {
  abstract createOrder(params: CreateOrderProps): Observable<Order>;
  abstract getOrders(): Observable<Order[]>;
}

@Injectable()
export class OrdersApiImpl implements OrdersApi {
  constructor(private httpClient: HttpClient) {}

  public createOrder(params: CreateOrderProps): Observable<Order> {
    const order$ = this.httpClient.post<Order>('http://localhost:3003', params);

    return order$;
  }

  public getOrders() {
    const order$ = this.httpClient.get<Order[]>('http://localhost:3003');

    return order$;
  }
}
