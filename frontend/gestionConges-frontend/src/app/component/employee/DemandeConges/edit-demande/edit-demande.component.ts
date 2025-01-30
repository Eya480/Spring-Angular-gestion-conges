import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeServiceService } from '../../service/employee-service.service';
import { AdminRHServiceService } from '../../../adminRH/service/admin-rhservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-demande',
  imports: [FormsModule,ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './edit-demande.component.html',
  styleUrl: './edit-demande.component.css'
})
export class EditDemandeComponent {
    demandeConge: any = {}; 
    errorMessage: string = '';
    typeConges: any[] = []; 
    token = localStorage.getItem('token'); 
  
    constructor(
      private activeRoute: ActivatedRoute,
      private employeeService: EmployeeServiceService, 
      private router: Router,
      private typeCService : AdminRHServiceService
    ) {}
  
    onSubmit(f: NgForm) {
      if (this.token) {
      if (f.valid) {
  
        const dataToSend = {
          dateDebut: this.demandeConge.dateDebut,
          dateFin: this.demandeConge.dateFin,
          typeConge: { nomTypeConge: this.demandeConge.typeConge.nomTypeConge },
          reason: this.demandeConge.reason,  
        };
  
        this.employeeService.updateDemandeConge(this.demandeConge.idDemande!, dataToSend,this.token)
          .subscribe({
            next: () => this.router.navigate(['/employee/demandeConges'],{
              state : {editedDemandeId : this.demandeConge.idDemande}
            }), // Redirection après succès
            error: (erreur) => {
              console.log(erreur);
              this.showError (erreur.error);
            }
          });
      }
    }}
  
    // Récupérer l'employé à éditer lors de l'initialisation
    ngOnInit(): void {  
      if (this.token)
      this.typeCService.getAllTypeC(this.token).subscribe({
        next: (data) => {
          this.typeConges = data; 
        },
        error: (error) => {
          this.showError ( "Erreur lors du chargement des type conges.");
        }
      });
  
      this.activeRoute.params.subscribe({
        next: (params) => {
          const id = params['id']; // Récupérer l'ID depuis l'URL
          if (id && this.token) {
            this.employeeService.getDemandeCongeById(id, this.token).subscribe({
              next: (data) => {
                //console.log(data)
                this.demandeConge = data; 
              },
              error: (error) => {
                this.showError ('Erreur lors de la récupération des données :'+ error); // Gérer l'erreur
              },
            });
          }
        },
        error: (error) => {
          this.showError ('Erreur lors de la récupération des paramètres :'+ error); 
        },
      });
    }
    showError(mess: string) {
      this.errorMessage = mess;
      setTimeout(() => {
        this.errorMessage = ''
      }, 3000)
    }

}
