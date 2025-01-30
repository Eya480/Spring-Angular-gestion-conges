import { Component } from '@angular/core';
import { EmployeeServiceService } from '../service/employee-service.service';
import { ServiceService } from '../../shared/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-e',
  imports: [CommonModule],
  templateUrl: './dashboard-e.component.html',
  styleUrl: './dashboard-e.component.css'
})
export class DashboardEComponent {
  demandeConges? : any [];
  employee? :any;
  token = localStorage.getItem("token");

  demandesEnAttente?: number = 0;
  demandesApprouvees?: number = 0;

  constructor(
    private employeService: EmployeeServiceService,
    private sharedService: ServiceService
  ) {}

  ngOnInit(): void {
    if (this.token) {
      this.employeService.getAllDemande(this.token).subscribe({
        next: (data) => {
          this.demandeConges = data;

          this.demandesEnAttente = this.demandeConges?.filter(d => d.statut === 'En_Attente').length;
          this.demandesApprouvees = this.demandeConges?.filter(d => d.statut === 'Approuve').length;
        },
        error: () => {
          console.error("Erreur lors du chargement des demandes.");
        }
      });
      this.sharedService.getProfile(this.token).subscribe({
        next: (data) => {
          this.employee = data.employe;
          console.log(data)
        },
        error: () => {
          console.error("Erreur lors du chargement de l'employé.");
        }
      });
    }
  }
}