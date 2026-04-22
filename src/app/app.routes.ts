import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then((m) => m.RegisterComponent),
  },

  {
    path: '',
    loadComponent: () =>
      import('./components/layout/main-layout/main-layout').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./components/taskList/taskList').then((m) => m.TaskListComponent),
      },
      {
        path: 'add-task',
        loadComponent: () =>
          import('./components/add-task/add-task').then((m) => m.AddTaskComponent),
      },
    ],
  },

  {
    path: '404',
    loadComponent: () =>
      import('./components/not-found/not-found').then((m) => m.NotFoundComponent),
  },
  { path: '**', redirectTo: '404' },
];

