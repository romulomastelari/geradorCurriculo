import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[DEBUG_LOG] AuthGuard - Checking authentication for route:', state.url);

  if (authService.isAuthenticated()) {
    console.log('[DEBUG_LOG] AuthGuard - User is authenticated, allowing navigation');
    return true;
  }

  // Store the attempted URL for redirecting after login
  console.log('[DEBUG_LOG] AuthGuard - User is not authenticated, storing redirect URL:', state.url);
  authService.redirectUrl = state.url;

  // Navigate to the login page
  console.log('[DEBUG_LOG] AuthGuard - Redirecting to login page');
  return router.parseUrl('/account/login');
};
