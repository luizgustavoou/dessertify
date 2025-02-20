import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { isAuthenticated } from '@/application/state/selectors/auth.selector';
import { map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store, private router: Router) {}

  canActivate() {
    return this.store.select(isAuthenticated).pipe(
      take(1),
      map((auth) => {
        if (!auth) {
          this.router.navigate(['/signin']);
          return false;
        }
        return true;
      })
    );
  }
}
