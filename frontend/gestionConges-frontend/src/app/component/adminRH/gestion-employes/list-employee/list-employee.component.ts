import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminRHServiceService } from '../../service/admin-rhservice.service';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../shared/service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-employee',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css'],
})
export class ListEmployeeComponent implements OnInit {
  employees?: any[]; // Liste filtrée
  originalEmployees?: any[]; // Liste complète
  dep: string = 'all'; 
  departements: string[] = []; 
  token = localStorage.getItem('token'); 

  constructor(
    private adminRhService: AdminRHServiceService,
    private router: Router,
    private sharedService: ServiceService
  ) {}

  ngOnInit(): void {
    // Charger les départements
    this.sharedService.getAllDepartements().subscribe({
      next: (data) => {
        this.departements = data.map((departement) => departement.nomDep); // Récupérer uniquement les noms
      },
      error: () => console.error('Erreur lors du chargement des départements.'),
    });

    // Charger les employés si le token est valide
    if (this.token) {
      this.loadEmployees();
    } else {
      console.error('Token introuvable dans le localStorage');
      this.router.navigate(['/login']);
    }
  }

  // Charger tous les employés
  loadEmployees(): void {
    this.adminRhService.getAllEmp(this.token!).subscribe({
      next: (data) => {
        this.employees = data;
        this.originalEmployees = [...data]; // Conserver une copie de la liste originale
      },
      error: (error) => console.error('Erreur lors du chargement des employés', error),
    });
  }

  // Supprimer un employé
  deleteEmployee(id: string | undefined): void {
    if (id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
        this.adminRhService.deleteEmployee(id, this.token!).subscribe({
          next: (data) => {
            console.log(data)
            this.employees = this.employees?.filter((c) => c.id !== id); // Retirer l'employé supprimé
          },
          error: (error) =>
            console.error("Erreur lors de la suppression de l'employé", error),
        });
      }
    } else {
      console.error("ID de l'employé est undefined");
    }
  }

  // Filtrer par département
  filter(): void {
    if (this.dep !== 'all') {
      this.employees = this.originalEmployees?.filter(
        (e) => e.departement.nomDep === this.dep
      );
    } else {
      this.resetFilter();
    }
  }

  // Réinitialiser les filtres
  resetFilter(): void {
    this.employees = [...(this.originalEmployees || [])]; // Restaurer la liste originale
    this.dep = 'all'; // Réinitialiser la sélection
  }
}
