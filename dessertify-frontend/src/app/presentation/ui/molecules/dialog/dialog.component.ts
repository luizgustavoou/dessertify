import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  constructor() {}
}
