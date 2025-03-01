import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isAuthenticated } from '@/application/state/selectors/auth.selector';
import { logout } from '@/application/state/actions/auth.action';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;

  isMenuOpen = true;

  constructor(private store: Store) {
    this.isLoggedIn$ = this.store.select(isAuthenticated);
  }

  onToolbarMenuToggle() {
    console.log('Toolbar menu toggle', this.isMenuOpen);
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.store.dispatch(logout());
  }
}
