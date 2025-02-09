import { Component } from '@angular/core';
import { ManagerServiceService } from '../service/manager-service.service';
import { forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-m',
  imports:[CommonModule],
  templateUrl: './dashboard-m.component.html',
  styleUrls: ['./dashboard-m.component.css']
})
export class DashboardMComponent {
  demandeConges?: any[];
  employee?: any;
  demandesEnAttente?: any[];
  nomDep?:string;
  nbDextension : number=0;
  token = localStorage.getItem("token");
  
  demandesApprouvees: number = 0;
  
  constructor(private managerService: ManagerServiceService) {}

  ngOnInit(): void {
    if (this.token) {
      this.managerService.getAllDemandeEquipe(this.token).subscribe({
        next: (data: any[]) => {
          console.log(data);
          // Filtrer les demandes en attente
          const demandesEnAttente = data.filter((d) => d.statut === 'En_Attente');
          this.nbDextension=data.filter((d)=> d.estDExtension==true).length;
          this.demandesEnAttente = demandesEnAttente;

          // Utilisation de forkJoin pour récupérer les employés en parallèle
          const demandesAvecEmploye$ = demandesEnAttente.map((demande) =>
            this.managerService.getEmployeByDemandeConge(this.token!, demande.idDemande).pipe(
              map((employe: any) => ({
                ...demande,
                employe,
              }))
            )
          );

          // Utiliser forkJoin pour attendre toutes les réponses avant de mettre à jour les variables
          forkJoin(demandesAvecEmploye$).subscribe({
            next: (demandesAvecEmployes) => {
              this.demandeConges = demandesAvecEmployes;
              this.nomDep=this.demandeConges[0].employe.departement.nomDep;

              // Calculer le nombre d'employés uniques en extrayant les employées
              const employesUnniques = new Set(demandesAvecEmployes.map(d => d.employe.id)); // Assurez-vous que chaque employé a un id unique

              // Calcul du nombre de demandes approuvées
              this.demandesApprouvees = demandesAvecEmployes.filter(d => d.statut === 'Approuve').length;
            },
            error: (error) => {
              console.error("Erreur lors de la récupération des employés", error);
            }
          });
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des demandes", error);
        }
      });
    }
  }
}
