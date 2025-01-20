import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminRHGuard } from '../guard/guard.guard';

const routes: Routes = [
  {
    path: '', // Default route for the adminRH module
    component: DashboardComponent,
    canActivate: [adminRHGuard] // Apply adminRHGuard here
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRHRoutingModule { }
