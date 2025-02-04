import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { guardGuard } from '../guard/guard.guard';
import { ListerDemandeComponent } from './DemandeConges/lister-demande/lister-demande.component';
import { AjouterDemandeComponent } from './DemandeConges/ajouter-demande/ajouter-demande.component';
import { EditDemandeComponent } from './DemandeConges/edit-demande/edit-demande.component';
import { DemandeExtensionComponent } from './DemandeConges/demande-extension/demande-extension.component';
import { DashboardEComponent } from './dashboard-e/dashboard-e.component';

const routes: Routes = [
  {
    path: 'dashboard', // Default route for the employee module
    component: DashboardEComponent,
    canActivate: [guardGuard] // Apply guardGuard here
  },{path : '',redirectTo : 'dashboard',pathMatch : 'full'}
    ,
    {
      path: 'demandeConges', 
      component: ListerDemandeComponent,
      canActivate: [guardGuard] // Apply adminRHGuard here
    },
    {
      path: 'addDemande', 
      component: AjouterDemandeComponent,
      canActivate: [guardGuard] // Apply adminRHGuard here
    },
    {
      path: 'editDemande/:id', 
      component: EditDemandeComponent,
      canActivate: [guardGuard] // Apply adminRHGuard here
    },
    {
      path: 'demandeExtension/:id', 
      component: DemandeExtensionComponent,
      canActivate: [guardGuard] // Apply adminRHGuard here
    },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
