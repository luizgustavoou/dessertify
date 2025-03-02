import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { MaterialModule } from '@/shared/material.module';
import { CartItemSkeletonComponent } from '@/presentation/molecules/cart-item-skeleton/cart-item-skeleton.component';
import { OrdersApi } from '@/infra/http/orders/orders.api';
import { Order } from '@/domain/models/orders';

interface RequestState<T = unknown> {
  loading: boolean;
  error?: Error | null;
  data?: T;
}

@Component({
  standalone: true,
  selector: 'app-orders-list',
  imports: [MaterialModule, CommonModule, CartItemSkeletonComponent],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent {
  store = inject(Store);
  ordersApi$ = inject(OrdersApi);

  orders$!: Observable<RequestState<Order[]>>;

  constructor() {}

  ngOnInit() {
    this.orders$ = this.ordersApi$.getOrders().pipe(
      map((orders) => ({
        loading: false,
        data: orders,
        error: null,
      })),
      startWith({ loading: true, error: null, data: [] }),
      catchError((error) => {
        return of({ loading: false, error, data: [] });
      })
    );
  }
}
