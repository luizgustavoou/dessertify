import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-conclude-order',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './conclude-order.component.html',
  styleUrl: './conclude-order.component.scss',
})
export class ConcludeOrderComponent {
  public data: any = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    console.log(this.data);
  }
}
