import { MaterialModule } from '@/shared/material.module';
import { Component, inject } from '@angular/core';
import {
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  standalone: true,
    selector: 'snack-bar-annotated-component-example-snack',
    templateUrl: 'pizza-party-annotated.component.html',
    styles: `
    :host {
      display: flex;
    }

    .example-pizza-party {
      color: hotpink;
    }
  `,
    imports: [MaterialModule]
})
export class PizzaPartyAnnotatedComponent {
  snackBarRef = inject(MatSnackBarRef);
}
