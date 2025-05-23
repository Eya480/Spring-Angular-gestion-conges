import { Component, OnInit } from '@angular/core';
import { AdminRHServiceService } from '../service/admin-rhservice.service';
import { ServiceService } from '../../shared/service.service';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { CommonModule } from '@angular/common';
import { ManagerServiceService } from '../../manager/service/manager-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  departements?: any[] = [];
  employees?: any[] = [];
  employe:any;
  refuse: number = 0;
  approuve: number = 0;
  att: number = 0;
  token = localStorage.getItem("token");
  nbtypeConges?: number = 0;

  absenceAjourdui?: any[] = [];  

  constructor(
    private sharedService: ServiceService,
    private TypeCService: AdminRHServiceService,
    private manService : ManagerServiceService
  ) {}

  countDemandesByStatus(demandes: any[], status: string): number {
    if (!demandes) return 0;
    return demandes.filter(d => d.statut === status).length;
  }

  countAllDemandesByStatus(demandes: any[]): void {
    if (!demandes) return;

    // Réinitialiser les totaux
    this.refuse = 0;
    this.approuve = 0;
    this.att = 0;

    // Parcours de toutes les demandes pour comptabiliser chaque statut
    demandes.forEach(demande => {
      switch(demande.statut) {
        case 'Refuse':
          this.refuse++;
          break;
        case 'Approuve':
          this.approuve++;
          break;
        case 'En_Attente':
          this.att++;
          break;
        default:
          break;
      }
    });
  }

  ngOnInit(): void {
    if (this.token) {
      this.TypeCService.getAllTypeC(this.token).subscribe({
        next: (data) => { this.nbtypeConges = data.length; },
        error: () => { console.error("Erreur lors du chargement des types de congés."); }
      });

      

      this.sharedService.getAllDepartements().subscribe({
        next: (data) => {
          //console.log("Departements data:", data);
          this.departements = data;

          const managerRequests = data.map(departement => {
            if (!departement.idDep) {
              console.error('Invalid department id:', departement);
              return of(null);
            }
            return this.TypeCService.getManagerByDepId(departement.idDep, this.token!).pipe(
              map((manager: any) => ({ departement, manager }))
            );
          });

          forkJoin(managerRequests).subscribe({
            next: (results) => {
              this.departements = results
                .filter((result: any) => result !== null)
                .map((result: any) => ({
                  ...result.departement,
                  manager: result.manager
                }));

              const demandeRequests = results.map((result: any) => {
                if (!result.manager.id) {
                  console.error('Invalid manager id:', result);
                  return of(null);
                }
                return this.TypeCService.getAllDemandeByManagerId(result.manager.id, this.token!).pipe(
                  map((demandes: any) => ({
                    departement: result.departement,
                    manager: result.manager,
                    demandes
                  }))
                );
              });

              forkJoin(demandeRequests).subscribe({
                next: (demandesResults) => {
                  //console.log("Demandes results:", demandesResults);
                  this.departements = demandesResults
                    .filter((result: any) => result !== null)
                    .map((result: any) => ({
                      ...result.departement,
                      manager: {
                        ...result.manager,
                        demandes: result.demandes
                      }
                    }));

                  const allDemandes = this.departements.flatMap(departement => departement.manager?.demandes || []);
                  this.countAllDemandesByStatus(allDemandes);
                  
                  this.absenceAjourdui = allDemandes
                  .filter(demande => this.isToday(demande.dateDebut))
                  .map(demande => ({ ...demande, employe: null })); // Initialisation de l'objet fusionné
                
                const observables = this.absenceAjourdui.map(demande =>
                  this.manService.getEmployeByDemandeConge(this.token!, demande.idDemande).pipe(
                    map(employe => ({ ...demande, employe })) // Associer chaque employé à sa demande
                  )
                );
                
                forkJoin(observables).subscribe({
                  next: (result) => {
                    this.absenceAjourdui = result; // Mettre à jour la liste avec les employés associés
                  },
                  error: (err) => {
                    console.error('Erreur lors de la récupération des employés:', err);
                  }
                });

                
                },
                error: (error) => { console.error("Erreur lors du chargement des demandes de l'équipe.", error); }
              });
            },
            error: (error) => { console.error("Erreur lors du chargement des managers.", error); }
          });
        },
        error: (error) => { console.error("Erreur lors du chargement des départements.", error); }
      });

      // Charger les employés
      this.TypeCService.getAllEmp(this.token!).subscribe({
        next: (data) => { this.employees = data; },
        error: (error) => { console.error('Erreur lors du chargement des employés', error); }
      });
    }
  }

  // Vérifier si une date est aujourd'hui
  isToday(date: string): boolean {
    const today = new Date();
    const absenceDate = new Date(date);
    return today.toDateString() === absenceDate.toDateString();
  }
}