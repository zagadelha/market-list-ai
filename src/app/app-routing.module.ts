import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account.account.page').then(m => m.AccountPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings.settings.page').then(m => m.SettingsPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about.about.page').then(m => m.AboutPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
