import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CartProduct, Product } from '../../../../domain/models/products';
import { AppState } from '../../../../application/state/app.state';
import { Store } from '@ngrx/store';
import { selectCartProducts } from '../../../../application/state/selectors/cart.selector';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../../shared/material.module';
import { SeparatorComponent } from "../../atoms/separator/separator.component";

interface Order {
  products: Product[];
}

@Component({
  selector: 'app-conclude-order',
  standalone: true,
  imports: [CommonModule, MaterialModule, SeparatorComponent],
  templateUrl: './conclude-order.component.html',
  styleUrl: './conclude-order.component.scss',
})
export class ConcludeOrderComponent {
  // private store = inject(Store<AppState>);

  // public cartProducts$ = this.store.select(selectCartProducts);

  cartProducts$: Observable<CartProduct[]>;

  constructor(private store: Store<AppState>) {
    this.cartProducts$ = this.store.select(selectCartProducts);
  }

  // public data: Order = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<ConcludeOrderComponent>);

  public closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.cartProducts$.subscribe((data) => {
      console.log(data);
    });
    console.log(this.cartProducts$);
    // console.log(this.data)
  }

  getTotal(): number {
    let total = 0;
    this.cartProducts$.subscribe((products) => {
      total = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
    });
    return total;
  }
}
