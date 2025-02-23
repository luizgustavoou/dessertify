import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartProduct, Product } from '@/domain/models/products';
import { MaterialModule } from '@/shared/material.module';
import { AppState } from '@/application/state/app.state';
import { selectCartProducts } from '@/application/state/selectors/cart.selector';

import { PizzaPartyAnnotatedComponent } from '@/presentation/molecules/pizza-party-annotated/pizza-party-annotated.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './addres-form.component.html',
  styleUrl: './addres-form.component.scss',
})
export class AddressFormComponent {
  @Output()
  public onContinue = new EventEmitter<any>();

  fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private _store = inject(Store<AppState>);

  @ViewChild('templateSnackBar') template: TemplateRef<unknown> | undefined;

  cartProducts$: Observable<CartProduct[]> =
    this._store.select(selectCartProducts);

  // public data: Order = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<AddressFormComponent>);

  public dialog = inject(MatDialog);

  form = this.fb.group({
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    zipcode: ['', Validators.required],
  });

  openSnackBar(message: string) {
    // this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
    //   duration: 1000,
    // });
    // this._snackBar.openFromTemplate(this.template!, {});
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  public continue() {
    if (this.form.invalid) {
      this.openSnackBar('Please fill all fields');
      return;
    }

    this.onContinue.emit(this.form.value);
  }
}
