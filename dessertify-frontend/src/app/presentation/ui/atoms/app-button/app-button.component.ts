import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
})
export class AppButtonComponent {
  @Input() variant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link' = 'default';
  @Input() size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  @Input() isDisabled: boolean = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    this.buttonClick.emit(event);
  }

  get buttonClasses(): string[] {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'whitespace-nowrap',
      'rounded-full',
      'text-sm',
      'font-medium',
      'ring-offset-background',
      'transition-colors',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
    ];

    const variantClasses: Record<string, string> = {
      default: 'bg-red-500 text-white hover:bg-red-600',
      destructive: 'bg-destructive text-destructive hover:bg-destructive/90',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent',
      secondary: 'bg-white hover:ring-1 border border-black hover:ring-red-500 hover:text-red-500 hover:border-none',
      ghost: 'hover:bg-accent hover:text-accent',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizeClasses: Record<string, string> = {
      default: 'h-10 px-4 py-2 w-full',
      sm: 'h-9 rounded-md px-3 w-full',
      lg: 'h-11 rounded-md px-8 w-full',
      icon: 'h-10 w-10',
    };

    return [
      ...baseClasses,
      variantClasses[this.variant],
      sizeClasses[this.size],
      this.isDisabled ? 'opacity-50 cursor-not-allowed' : '',
    ];
  }
}
