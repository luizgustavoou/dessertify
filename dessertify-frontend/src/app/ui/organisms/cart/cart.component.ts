import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from '../../../application/states/app.state';
import { Product, CartProduct } from '../../../domain/entities/products';
import {
  selectCartProducts,
  selectCartTotal,
} from '../../../application/selectors/cart.selector';
import { MatIconModule } from '@angular/material/icon';
import { clearProduct } from '../../../application/actions/cart.action';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
// import { DialogComponent } from '../../molecules/dialog/dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    AppButtonComponent,
    // DialogComponent,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  myContext = { $implicit: 'World', localSk: 'Svet' };

  cartProducts$: Observable<CartProduct[]>;
  cartProductsLength$: Observable<number>;

  @ViewChild('myTemplate', {read: TemplateRef}) myTemplate!: TemplateRef<unknown> | undefined; // Referência ao ng-template
  @ViewChild('viewContainer', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef; // Referência ao container onde o template será inserido


  public dialog = inject(MatDialog);

  openDialog(template: TemplateRef<any>): void {
    this.dialog.open(template, {
      data: {
        name: 'Luiz',
      },
    });
  }

  constructor(private store: Store<AppState>) {
    this.cartProducts$ = this.store.select(selectCartProducts);
    this.cartProductsLength$ = this.store.select(selectCartTotal);
  }

  handleRemoveProduct(product: Product) {
    this.store.dispatch(clearProduct({ id: product.id }));
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
