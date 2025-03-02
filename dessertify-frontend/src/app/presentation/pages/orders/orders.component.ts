import { CartComponent } from '@/presentation/organisms/cart/cart.component';
import { OrdersListComponent } from '@/presentation/organisms/orders-list/orders-list.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './orders.component.html',
  imports: [OrdersListComponent],
})
export class OrdersComponent {}
