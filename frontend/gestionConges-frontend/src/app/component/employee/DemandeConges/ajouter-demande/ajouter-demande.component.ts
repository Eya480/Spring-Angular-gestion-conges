import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeServiceService } from '../../service/employee-service.service';
import { AdminRHServiceService } from '../../../adminRH/service/admin-rhservice.service';

@Component({
  selector: 'app-ajouter-demande',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './ajouter-demande.component.html',
  styleUrl: './ajouter-demande.component.css'
})
export class AjouterDemandeComponent {
  AddDemandeForm!: FormGroup;
  errorMessage: string = '';
  typeConges? : any [];
  token=localStorage.getItem('token');
    
  constructor(private fb: FormBuilder,private employeeService: EmployeeServiceService, private router: Router
      ,private adminRhService : AdminRHServiceService) {
        this.AddDemandeForm = this.fb.group({
          dateDebut: [''],
          dateFin: [''],
          nomTypeConge : [''],
          reason : ['']
        });
      }
    
      ngOnInit(): void {
        if(this.token)
          this.adminRhService.getAllTypeC(this.token).subscribe({
            next: (data) => {
              this.typeConges = data;
            },
            error: (error) => {
              console.error ("Erreur lors du chargement des types conges.");
            }
          });
      }
      
    
      onSubmit(): void {
        const Data = this.AddDemandeForm.value;
        const dataToSend = {
          dateDebut: Data.dateDebut,
          dateFin: Data.dateFin,
          typeConge : {nomTypeConge:Data.nomTypeConge},
          reason : Data.reason
        };
        if(this.token){
        this.employeeService.soumettreDemandeConge(dataToSend,this.token).subscribe({
          next: () => {this.router.navigate(['/employee/demandeConges']);},
          error: (errorRep) => {
            if (errorRep.status==400){
              this.showError(errorRep.error); 
            }
            else {
              console.log(errorRep)
              this.showError("Une erreur inattendue s'est produite.");
            }
          }
        });
      }}
      showError(mess: string) {
        this.errorMessage = mess;
        setTimeout(() => {
          this.errorMessage = ''
        }, 3000)
      }
    


}
