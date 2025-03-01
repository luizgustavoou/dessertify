import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
} from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDividerModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatBadgeModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
  ],
})
export class MaterialModule {}
