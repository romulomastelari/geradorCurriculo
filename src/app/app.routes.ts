import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/resume/pages/home/home.component').then(m => m.HomeComponent) },
  {
    path: 'account',
    loadChildren: () => import('./features/account/account.routes').then(m => m.ACCOUNT_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/resume/resume.routes').then(m => m.RESUME_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/home' }
];
