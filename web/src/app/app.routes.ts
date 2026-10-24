import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Академический календарь УТС(м)-1-26',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  { path: '**', redirectTo: '' },
];
