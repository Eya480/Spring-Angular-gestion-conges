import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminRHServiceService } from '../../service/admin-rhservice.service';
import { ServiceService } from '../../../shared/service.service';

@Component({
  selector: 'app-employee-details',
  imports: [RouterModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {
  employee?: any;
  token = localStorage.getItem('token'); 

  constructor(private adminRhService: AdminRHServiceService, private router : Router,private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe({
      next: (params) => {
        const id = params['id']; // Récupérer l'ID depuis l'URL
        if (id && this.token) {
          this.adminRhService.getEmployeeById(id, this.token).subscribe({
            next: (employeeData) => {
              this.employee = employeeData; // Assigner les données de l'employé
            },
            error: (error) => {
              console.error('Erreur lors de la récupération des données :', error); // Gérer l'erreur
            },
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des paramètres :', error); // Gérer une erreur dans les paramètres
      },
    });
  }
}
