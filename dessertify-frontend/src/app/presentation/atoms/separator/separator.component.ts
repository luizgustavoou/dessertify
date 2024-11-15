import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-separator',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './separator.component.html',
  styleUrl: './separator.component.scss'
})
export class SeparatorComponent {

}
