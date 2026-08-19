import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  setToken(token: string): void {
    window.localStorage.setItem('token', token);
  }

  removeToken(): void {
    window.localStorage.removeItem('token');
  }

  getToken() {
    const token = window.localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return token;
  }

  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  signout() {
    this.removeToken();
    window.localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
