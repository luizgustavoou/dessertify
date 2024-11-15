import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CartProduct, Product } from '../../../domain/models/products';
import { AppState } from '../../../application/state/app.state';
import { Store } from '@ngrx/store';
import { selectCartProducts } from '../../../application/state/selectors/cart.selector';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { SeparatorComponent } from '../../atoms/separator/separator.component';
import { clear } from '../../../application/state/actions/cart.action';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { PizzaPartyAnnotatedComponent } from '../../molecules/pizza-party-annotated/pizza-party-annotated.component';

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
  private _snackBar = inject(MatSnackBar);
  private _store = inject(Store<AppState>);

  @ViewChild(TemplateRef) template: TemplateRef<unknown> | undefined;

  cartProducts$: Observable<CartProduct[]> =
    this._store.select(selectCartProducts);

  // public data: Order = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<ConcludeOrderComponent>);

  openSnackBar() {
    // this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
    //   duration: 1000,
    // });
    // this._snackBar.openFromTemplate(this.template!, {});
    this._snackBar.open('Dessert order completed successfully!', 'Close', {
      duration: 3000
    });
  }

  public concludeOrder() {
    // TODO: Fazer uma requisição para o backend e criar uma order

    this._store.dispatch(clear());
    this.openSnackBar();
    this.dialogRef.close();
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
