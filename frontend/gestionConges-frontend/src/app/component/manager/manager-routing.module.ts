import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMComponent } from './dashboard-m/dashboard-m.component';
import { managerGuard } from '../guard/guard.guard';

const routes: Routes = [
  {
    path: '', // Default route for the manager module
    component: DashboardMComponent,
    canActivate: [managerGuard] // Apply managerGuard here
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
