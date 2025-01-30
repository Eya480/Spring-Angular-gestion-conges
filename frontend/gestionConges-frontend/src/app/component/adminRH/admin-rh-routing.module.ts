import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminRHGuard } from '../guard/guard.guard';
import { ListEmployeeComponent } from './gestion-employes/list-employee/list-employee.component';
import { AddEmployeeComponent } from './gestion-employes/add-employee/add-employee.component';
import { EditEmployeeComponent } from './gestion-employes/edit-employee/edit-employee.component';
import { ListTypeCongesComponent } from './gestion-typeConges/list-type-conges/list-type-conges.component';
import { AddTypeCongesComponent } from './gestion-typeConges/add-type-conges/add-type-conges.component';
import { EmployeeDetailsComponent } from './gestion-employes/employee-details/employee-details.component';

const routes: Routes = [
  {
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [adminRHGuard] // Apply adminRHGuard here
  },
  {path : '',redirectTo : 'dashboard',pathMatch : 'full'}
  ,
  {
    path: 'employees', 
    component: ListEmployeeComponent,
    canActivate: [adminRHGuard] // Apply adminRHGuard here
  },
  {
    path :'addEmployee',
    component : AddEmployeeComponent,
    canActivate : [adminRHGuard]
  },{
    path : 'editEmployee/:id',
    component : EditEmployeeComponent,
    canActivate : [adminRHGuard]
  },
  {
    path : 'employeeDetails/:id',
    component : EmployeeDetailsComponent,
    canActivate : [adminRHGuard]
  },
  {
    path: 'typeConges', 
    component: ListTypeCongesComponent,
    canActivate: [adminRHGuard] 
  },
  {
    path :'addTypeConges',
    component : AddTypeCongesComponent,
    canActivate : [adminRHGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRHRoutingModule { }
