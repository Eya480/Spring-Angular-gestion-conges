import { Routes } from '@angular/router';
import { LoginComponent } from './component/auth/login/login.component';
import { ProfileComponent } from './component/shared/profile/profile.component';
import { guardGuard } from './component/guard/guard.guard';

export const routes:  Routes = [
    {
    path: 'admin',
    loadChildren: () => import('./component/admin/admin.module').then(m => m.AdminModule) // Lazy load AdminModule
  },
  {
    path: 'adminRH',
    loadChildren: () => import('./component/adminRH/admin-rh.module').then(m => m.AdminRHModule) // Lazy load AdminRHModule
  },
  {
    path: 'employee',
    loadChildren: () => import('./component/employee/employee.module').then(m => m.EmployeeModule) // Lazy load EmployeeModule
  },
  {
    path: 'manager',
    loadChildren: () => import('./component/manager/manager.module').then(m => m.ManagerModule) // Lazy load ManagerModule
  },
  {path: 'profile', component: ProfileComponent, canActivate: [guardGuard]},
  {
    path: 'login', // Login page
    component: LoginComponent
  },
  { path: '**', redirectTo: '/login' }, // Wildcard route for unknown paths
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Default route
];

  
