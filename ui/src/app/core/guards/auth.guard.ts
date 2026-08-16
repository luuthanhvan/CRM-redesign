import { Injectable, inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '~features/authentication/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      this.authService.removeToken();
      // clear all value from local storage
      window.localStorage.clear();
      return false;
    }

    return true;
  }
}
