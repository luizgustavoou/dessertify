import { MaterialModule } from '@/shared/material.module';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-separator',
  imports: [MaterialModule],
  templateUrl: './separator.component.html',
  styleUrl: './separator.component.scss',
})
export class SeparatorComponent {}
