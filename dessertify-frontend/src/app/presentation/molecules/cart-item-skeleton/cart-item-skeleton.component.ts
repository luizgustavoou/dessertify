import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-cart-item-skeleton',
    imports: [CommonModule],
    templateUrl: './cart-item-skeleton.component.html',
    styleUrl: './cart-item-skeleton.component.scss'
})
export class CartItemSkeletonComponent {
  @Input() count = 11;

  get arrayCount() {
    return new Array(this.count);
  }
}
