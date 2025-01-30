import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminRHServiceService } from '../../service/admin-rhservice.service';
import { ServiceService } from '../../../shared/service.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit {
  employee: any = {}; // Utilisation du modèle Employee
  errorMessage: string = '';
  maxValue : number = 0;
  departements: string[] = []; // List of available departments
  postes: string[] = [
    'Développeur Frontend',
    'Développeur Backend',
    'Chef de projet',
    'Administrateur systèmes',
    'Ingénieur réseaux',
    'Analyste fonctionnel',
    'Consultant',
    'Testeur QA',
    'Architecte logiciel',
    'Data Scientist',
  ];
  roles: string[] = [];
  token = localStorage.getItem('token'); 

  constructor(
    private activeRoute: ActivatedRoute,
    private employeeService: AdminRHServiceService, // Service Employee
    private sharedService : ServiceService,
    private router: Router,
  ) {}

  // Méthode pour éditer un employé
  editEmployee(f: NgForm) {
    if (this.token) {
    if (f.valid) {

      const dataToSend = {
        CIN: this.employee.cin,
        nom: this.employee.nom,
        prenom: this.employee.prenom,
        tel: this.employee.tel,
        email: this.employee.email,
        pwd: this.employee.pwd,
        departement: {
          nomDep: this.employee.departement.nomDep,
        },
        dateEmbauche: this.employee.dateEmbauche,  
        poste: this.employee.poste,
      };

      this.employeeService.updateEmployee(this.employee.id!, dataToSend,this.token)
        .subscribe({
          next: () => this.router.navigate(['/adminRH/employees'],{
            state : {editedEmployeeId : this.employee.id}
          }), // Redirection après succès
          error: () => {
            this.errorMessage = 'Une erreur est survenue lors de la mise à jour de l’employé.';
          }
        });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }}

  // Récupérer l'employé à éditer lors de l'initialisation
  ngOnInit(): void {
    this.roles=['User','AdminRH','Manager']
    
    this.sharedService.getAllDepartements().subscribe({
      next: (data) => {
        this.departements = data.map(departement => departement.nomDep); // Just get names
      },
      error: (error) => {
        this.errorMessage = "Erreur lors du chargement des départements.";
      }
    });

    this.activeRoute.params.subscribe({
      next: (params) => {
        const id = params['id']; // Récupérer l'ID depuis l'URL
        if (id && this.token) {
          this.employeeService.getEmployeeById(id, this.token).subscribe({
            next: (employeeData) => {
              this.maxValue = this.employee.soldeInitial;
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