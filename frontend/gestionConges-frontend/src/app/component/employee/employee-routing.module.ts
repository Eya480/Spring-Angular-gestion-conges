import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../adminRH/dashboard/dashboard.component';
import { guardGuard } from '../guard/guard.guard';

const routes: Routes = [
  {
    path: '', // Default route for the employee module
    component: DashboardComponent,
    canActivate: [guardGuard] // Apply guardGuard here
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
