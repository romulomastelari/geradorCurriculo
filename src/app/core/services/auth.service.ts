import { Injectable } from '@angular/core';

export interface IAuthService {
  isAuthenticated(): boolean;
  redirectUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {
  private _redirectUrl: string | undefined;

  // In a real app, this would check for a valid token or session
  isAuthenticated(): boolean {
    // Mock implementation - would normally check localStorage/sessionStorage
    // or a token service to determine if the user is authenticated
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    console.log('[DEBUG_LOG] AuthService - isAuthenticated:', isAuth);
    return isAuth;
  }

  get redirectUrl(): string | undefined {
    console.log('[DEBUG_LOG] AuthService - Getting redirectUrl:', this._redirectUrl);
    return this._redirectUrl;
  }

  set redirectUrl(url: string | undefined) {
    console.log('[DEBUG_LOG] AuthService - Setting redirectUrl:', url);
    this._redirectUrl = url;
  }

  // Mock login method
  login(username: string, password: string): boolean {
    console.log('[DEBUG_LOG] AuthService - Attempting login for user:', username);
    // In a real app, this would make an API call
    // and store the token in localStorage/sessionStorage
    if (username && password) {
      localStorage.setItem('isAuthenticated', 'true');
      console.log('[DEBUG_LOG] AuthService - Login successful');
      return true;
    }
    console.log('[DEBUG_LOG] AuthService - Login failed');
    return false;
  }

  // Mock logout method
  logout(): void {
    console.log('[DEBUG_LOG] AuthService - Logging out user');
    localStorage.removeItem('isAuthenticated');
  }
}
