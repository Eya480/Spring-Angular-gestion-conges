import { Routes } from '@angular/router';
import { adminGuard, adminRHGuard, managerGuard, usersGuard } from './component/guards/users.guard';
import { DashboardComponent } from './component/adminRH/dashboard/dashboard.component';
import { DashboardEComponent } from './component/employee/dashboard-e/dashboard-e.component';
import { DashboardAComponent } from './component/admin/dashboard-a/dashboard-a.component';
import { LoginComponent } from './component/auth/login/login.component';
import { DashboardMComponent } from './component/manager/dashboard-m/dashboard-m.component';
import { GestionEmployesComponent } from './component/adminRH/gestion-employes/gestion-employes.component';

export const routes:  Routes = [
    {
      path: 'employee-dashboard',  // Route protected by usersGuard
      component: DashboardEComponent,
      canActivate: [usersGuard] // Apply usersGuard here
    },
    {
      path: 'admin-dashboard',  // Route protected by adminGuard
      component: DashboardAComponent,
      canActivate: [adminGuard] // Apply adminGuard here
    },{
        path: 'adminRH-dashboard',  // Route protected by adminGuard
        component: DashboardComponent,
        canActivate: [adminRHGuard] // Apply adminGuard here
      },
      {
        path: 'gestion-conge',  // Route pour la gestion des congés, protégée par adminRHGuard
        component: GestionEmployesComponent,  // Ajout du composant gestion des congés
        canActivate: [adminRHGuard] // Application de adminRHGuard ici
      }
    ,{
        path: 'manager-dashboard',  // Route protected by adminGuard
        component: DashboardMComponent,
        canActivate: [managerGuard] // Apply adminGuard here
      }
    ,
    {
      path: 'login',  // Login page
      component: LoginComponent
    },
    { path: '**', redirectTo: '/login' },
    {path: '', redirectTo: '/login', pathMatch: 'full'},  
  ];
  
