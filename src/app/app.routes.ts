import { Routes } from '@angular/router';
import { APP_ROUTES } from './app.paths';

export const routes: Routes = [
  { path: APP_ROUTES.home, loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: APP_ROUTES.contact, loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
];
