import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent)
      },
      {
        path: 'success',
        loadComponent: () => import('./pages/success/success.component').then(m => m.SuccessComponent)
      },
      {
        path: 'cancel',
        loadComponent: () => import('./pages/cancel/cancel.component').then(m => m.CancelComponent)
      }
    ]
  }
];
