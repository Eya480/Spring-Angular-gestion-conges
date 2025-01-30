import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../guard/guard.guard';
import { DashboardAComponent } from './dashboard-a/dashboard-a.component';
import { ListDepartsComponent } from './gestion-departement/list-departs/list-departs.component';
import { AddDepartsComponent } from './gestion-departement/add-departs/add-departs.component';

const routes: Routes = [
  {
    path: 'dashboard', // Default route for the admin module
    component: DashboardAComponent,
    canActivate: [adminGuard] // Apply adminGuard here
  },
  {path : '',redirectTo : 'dashboard',pathMatch : 'full'}
    ,
    {
      path: 'departement', 
      component: ListDepartsComponent,
      canActivate: [adminGuard] // Apply adminRHGuard here
    },{
      path : 'addDepartement',
      component : AddDepartsComponent,
      canActivate: [adminGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
