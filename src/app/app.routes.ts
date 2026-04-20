import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { HomeComponent } from './components/home/home';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';
import { TaskListComponent } from './components/taskList/taskList';
import { AddTaskComponent } from './components/add-task/add-task';
import { NotFoundComponent } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'tasks', component: TaskListComponent },
      { path: 'add-task', component: AddTaskComponent },
    ],
  },

  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];
