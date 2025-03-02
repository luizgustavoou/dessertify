import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/material.module';
import { CartProduct, Product } from '@/domain/models/products';

@Component({
  standalone: true,
  selector: 'app-cart-item',
  imports: [CommonModule, MaterialModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  @Input() product!: Product;
  @Input() cartProduct: CartProduct | null | undefined;

  @Output() addProduct = new EventEmitter<MouseEvent>();
  @Output() removeProduct = new EventEmitter<MouseEvent>();

  onAddProduct(event: MouseEvent) {
    this.addProduct.emit(event);
  }

  onRemoveProduct(event: MouseEvent) {
    this.removeProduct.emit(event);
  }
}
