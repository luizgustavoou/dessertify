import { CartComponent } from '@/presentation/organisms/cart/cart.component';
import { DessertsListComponent } from '@/presentation/organisms/desserts-list/desserts-list.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
    selector: 'app-root',
    templateUrl: './home.component.html',
    imports: [DessertsListComponent, CartComponent]
})
export class HomeComponent {}
