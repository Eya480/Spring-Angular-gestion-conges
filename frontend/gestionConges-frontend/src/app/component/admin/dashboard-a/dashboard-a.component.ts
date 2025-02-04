import { Component } from '@angular/core';
import { departements } from '../../../interfaces/departementsInt';
import { AdminServiceService } from '../service/admin-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../../shared/service.service';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Component({
  selector: 'app-dashboard-a',
  imports: [CommonModule],
  templateUrl: './dashboard-a.component.html',
  styleUrl: './dashboard-a.component.css'
})
export class DashboardAComponent{
  nbUtilisateurs : number=0;
  nbDepartements : number=0;
  users? : any [];
  token = localStorage.getItem("token");
  departements?: any[];

  constructor(private adminService : AdminServiceService, private modalService : NgbModal, private sharedService: ServiceService){}

  ngOnInit(): void {
    if (this.token) {
      this.adminService.getAllUsers(this.token).subscribe({
        next: (data) => {
          this.users = data.personnelList.filter((u: any) => u.role !== 'Admin') || [];
        },
        error: () => {
          console.error("Erreur lors du chargement des users.");
        }
      });

      this.sharedService.getAllDepartements().subscribe({
        next: (data) => {
          //console.log("Departements data:", data); // Log des données des départements
          this.departements = data;

          const managerRequests = data.map(departement => {
            if (!departement.idDep) {
              console.error('Identifiant de département invalide:', departement); // Log des départements invalides
              return of(null); // Retourner un observable null si idDep est manquant
            }
            return this.adminService.getManagerByDepId(departement.idDep, this.token!).pipe(
              map((manager: any) => ({ departement, manager }))
            );
          });

          forkJoin(managerRequests).subscribe({
            next: (results) => {
              //console.log("Résultats des managers:", results); // Log des résultats des managers
              this.departements = results
                .filter((result: any) => result !== null) // Filtrage des résultats invalides
                .map((result: any) => ({
                  ...result.departement,
                  manager: result.manager
                }));

              // Affichage des départements avec leurs managers
              //console.log(this.departements);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des managers :', err);
            }
          });
        },
        error: () => {
          console.error('Erreur lors du chargement des départements.');
        }
      });
    }
  }
}