import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  inject,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartProduct, Product } from '@/domain/models/products';
import { MaterialModule } from '@/shared/material.module';
import { AppState } from '@/application/state/app.state';
import { selectCartProducts } from '@/application/state/selectors/cart.selector';

import { PizzaPartyAnnotatedComponent } from '@/presentation/molecules/pizza-party-annotated/pizza-party-annotated.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { BrazilApi } from '@/infra/http/brazil/brazil.api';
@Component({
    selector: 'app-address-form',
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        MatInputModule,
        CommonModule,
        MaterialModule,
    ],
    templateUrl: './addres-form.component.html',
    styleUrl: './addres-form.component.scss'
})
export class AddressFormComponent {
  @Output()
  public onContinue = new EventEmitter<any>();

  fb = inject(FormBuilder);
  httpClient = inject(HttpClient);
  private brazilApi = inject(BrazilApi);
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
    zipcode: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
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

  ngAfterViewInit() {
    this.form.controls.zipcode.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((value: string | null) => value !== null),
        filter((value: string) => /^[0-9]{8}$/.test(value)),
        switchMap((value) =>
          this.brazilApi.cep({ cep: value }).pipe(
            catchError((error) => {
              this.openSnackBar('Invalid zipcode');
              return of(null);
            })
          )
        )
      )
      .subscribe((value) => {
        if (!value) {
          return;
        }
        this.form.patchValue({
          country: 'Brasil',
          state: value.uf,
          city: value.localidade,
          street: value.logradouro,
        });
      });
  }
}
