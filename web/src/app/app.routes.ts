import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Академический календарь УТС(м)-1-26',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'materials',
    title: 'Материалы · УТС(м)-1-26',
    loadComponent: () => import('./features/materials/materials').then((m) => m.Materials),
  },
  { path: '**', redirectTo: '' },
];
