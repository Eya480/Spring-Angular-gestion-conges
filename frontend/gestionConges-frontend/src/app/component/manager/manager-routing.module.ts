import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMComponent } from './dashboard-m/dashboard-m.component';
import { managerGuard } from '../guard/guard.guard';
import { HistoriqueDemandesComponent } from './historique-demandes/historique-demandes.component';
import { DemandesEnAttenteComponent } from './gestion-demandeEquipe/demandes-en-attente/demandes-en-attente.component';

const routes: Routes = [
  {
    path: 'dashboard', // Default route for the manager module
    component: DashboardMComponent,
    canActivate: [managerGuard] // Apply managerGuard here
  },{path : '',redirectTo : 'dashboard',pathMatch : 'full'}
      ,
      {
        path: 'historiqueDemandesEquipe', 
        component: HistoriqueDemandesComponent,
        canActivate: [managerGuard] // Apply adminRHGuard here
      },
      {
        path: 'demandeEnAttente', 
        component: DemandesEnAttenteComponent,
        canActivate: [managerGuard] // Apply adminRHGuard here
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
