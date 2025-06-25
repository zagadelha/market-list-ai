import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage)
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'conta',
    loadComponent: () => import('./pages/account.account.page').then(m => m.AccountPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/settings.settings.page').then(m => m.SettingsPage),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];