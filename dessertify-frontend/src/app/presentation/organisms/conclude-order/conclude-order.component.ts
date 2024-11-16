import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { CartProduct, Product } from '@/domain/models/products';
import { SeparatorComponent } from '@/presentation/atoms/separator/separator.component';
import { MaterialModule } from '@/shared/material.module';
import { AppState } from '@/application/state/app.state';
import { selectCartProducts } from '@/application/state/selectors/cart.selector';
import { clear } from '@/application/state/actions/cart.action';

import { PizzaPartyAnnotatedComponent } from '@/presentation/molecules/pizza-party-annotated/pizza-party-annotated.component';

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

  @ViewChild('templateSnackBar') template: TemplateRef<unknown> | undefined;

  cartProducts$: Observable<CartProduct[]> =
    this._store.select(selectCartProducts);

  // public data: Order = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<ConcludeOrderComponent>);

  public dialog = inject(MatDialog);

  openSnackBar() {
    // this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
    //   duration: 1000,
    // });
    // this._snackBar.openFromTemplate(this.template!, {});
    this._snackBar.open('Dessert order completed successfully!', 'Close', {
      duration: 3000,
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
