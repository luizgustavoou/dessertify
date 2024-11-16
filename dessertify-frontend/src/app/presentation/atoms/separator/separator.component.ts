import { MaterialModule } from '@/shared/material.module';
import { Component } from '@angular/core';

@Component({
  selector: 'app-separator',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './separator.component.html',
  styleUrl: './separator.component.scss'
})
export class SeparatorComponent {

}
