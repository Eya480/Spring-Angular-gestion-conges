import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeServiceService } from '../../service/employee-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-demande-extension',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './demande-extension.component.html',
  styleUrl: './demande-extension.component.css'
})
export class DemandeExtensionComponent {
  extensionForm!: FormGroup;
  errorMessage: string = '';
  demandeConge : any={};
  id? : any;
  token=localStorage.getItem('token');
    

  constructor(private fb: FormBuilder,private employeeService: EmployeeServiceService, 
    private router: Router,private activeRoute: ActivatedRoute,
        ) {
          this.extensionForm = this.fb.group({
            dateFin: [''],
            reason : ['']
          });
        }
      
        ngOnInit(): void {
          this.activeRoute.params.subscribe({
            next: (params) => {
              this.id = params['id']; // Récupérer l'ID depuis l'URL
              if (this.id && this.token) {
                this.employeeService.getDemandeCongeById(this.id, this.token).subscribe({
                  next: (data) => {
                    //console.log(data)
                    this.demandeConge = data; 
                  },
                  error: (error) => {
                    this.showError ('Erreur lors de la récupération des données :'+ error.error); // Gérer l'erreur
                  },
                });
              }
            },
            error: (error) => {
              this.showError ('Erreur lors de la récupération des paramètres :'+ error); 
            },
          });
        }
        
      
        onSubmit(): void {
          const Data = this.extensionForm.value;
          if(this.token){
          this.employeeService.demandeExtension(this.id,Data,this.token).subscribe({
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
