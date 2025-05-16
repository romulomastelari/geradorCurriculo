import { Routes } from '@angular/router';
import { resumeCountGuard } from '../../core/guards/resume-count.guard';

export const RESUME_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/editor/editor.component').then(m => m.EditorComponent),
        canActivate: [resumeCountGuard]
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/editor/editor.component').then(m => m.EditorComponent)
      },
      {
        path: 'preview/:id',
        loadComponent: () => import('./pages/preview/preview.component').then(m => m.PreviewComponent)
      },
      {
        path: 'templates',
        loadComponent: () => import('./pages/templates/templates.component').then(m => m.TemplatesComponent)
      }
    ]
  }
];
