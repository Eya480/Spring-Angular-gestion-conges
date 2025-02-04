import { Component } from '@angular/core';
import { EmployeeServiceService } from '../service/employee-service.service';
import { ServiceService } from '../../shared/service.service';
import { CommonModule } from '@angular/common';
import { AdminRHServiceService } from '../../adminRH/service/admin-rhservice.service';

@Component({
  selector: 'app-dashboard-e',
  imports: [CommonModule],
  templateUrl: './dashboard-e.component.html',
  styleUrl: './dashboard-e.component.css'
})
export class DashboardEComponent {
  demandeConges? : any [];
  employee? :any;
  typeConges? : any [];
  currentDate: Date = new Date();
  upcomingHolidays  = [
    { date: '2025-02-20', name: 'Jour de la Révolution' },
    { date: '2025-03-20', name: 'Fête de l\'Indépendance' },
    { date: '2025-04-09', name: 'Fête du Travail' },
    { date: '2025-07-25', name: 'Fête de la République' },
    { date: '2025-08-13', name: 'Fête de la Femme' },
    { date: '2025-10-15', name: 'Fête de l\'Évacuation' },
    { date: '2025-12-17', name: 'Fête de la Révolution' },
  ];

  getUpcomingHolidays() {
    return this.upcomingHolidays.filter(holiday => new Date(holiday.date) >= this.currentDate);
  }
  
  
  token = localStorage.getItem("token");

  demandesEnAttente?: number = 0;
  demandesApprouvees?: number = 0;

  constructor(
    private employeService: EmployeeServiceService,
    private sharedService: ServiceService,
    private adminRhService : AdminRHServiceService
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

      this.adminRhService.getAllTypeC(this.token).subscribe({
        next: (data) => {
          this.typeConges = data;
        },
        error: (error) => {
          console.error ("Erreur lors du chargement des types conges.");
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