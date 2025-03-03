import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { MaterialModule } from '@/shared/material.module';
import { CartItemSkeletonComponent } from '@/presentation/molecules/cart-item-skeleton/cart-item-skeleton.component';
import { OrdersApi } from '@/infra/http/orders/orders.api';
import { Order } from '@/domain/models/orders';
import { MatDialog } from '@angular/material/dialog';
import { PaymentFormComponent } from '@/presentation/organisms/payment-form/payment-form.component';

interface RequestState<T = unknown> {
  loading: boolean;
  error?: Error | null;
  data?: T;
}

@Component({
  standalone: true,
  selector: 'app-orders-list',
  imports: [
    MaterialModule,
    CommonModule,
    CartItemSkeletonComponent,
    PaymentFormComponent,
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent {
  @ViewChild('paymentForm') paymentForm!: TemplateRef<any>;

  dialog = inject(MatDialog);
  store = inject(Store);
  ordersApi$ = inject(OrdersApi);

  orders$!: Observable<RequestState<Order[]>>;

  pay(order: Order) {
    this.dialog.open(this.paymentForm, {
      data: { order },
      width: '600px',
      maxWidth: '100vw',
      height: '600px',
    });
  }

  handlePaid(order: Order) {
    this.orders$ = this.orders$.pipe(
      map((state) => ({
        ...state,
        data: state.data?.map((o) =>
          o.id === order.id ? { ...o, paid: true } : o
        ),
      }))
    );
  }

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
