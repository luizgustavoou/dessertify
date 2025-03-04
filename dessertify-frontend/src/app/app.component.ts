import { Component, signal, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isAuthenticated } from '@/application/state/selectors/auth.selector';
import { logout } from '@/application/state/actions/auth.action';
import { selectCartTotal } from '@/application/state/selectors/cart.selector';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent {
  store = inject(Store);

  cartProductsLength$: Observable<number>;

  isLoggedIn$: Observable<boolean>;

  isMenuOpen = false;

  public isDarkTheme = signal(this.getInitialTheme());

  constructor() {
    this.cartProductsLength$ = this.store.select(selectCartTotal);
    this.isLoggedIn$ = this.store.select(isAuthenticated);

    effect(() => {
      if (this.isDarkTheme()) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  }

  onToolbarMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.store.dispatch(logout());
  }

  toggleDarkMode() {
    this.isDarkTheme.update((value) => !value);
  }

  private getInitialTheme(): boolean {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return theme;
  }
}
