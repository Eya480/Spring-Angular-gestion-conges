import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../adminRH/dashboard/dashboard.component';
import { adminGuard } from '../guard/guard.guard';

const routes: Routes = [
  {
    path: '', // Default route for the admin module
    component: DashboardComponent,
    canActivate: [adminGuard] // Apply adminGuard here
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
