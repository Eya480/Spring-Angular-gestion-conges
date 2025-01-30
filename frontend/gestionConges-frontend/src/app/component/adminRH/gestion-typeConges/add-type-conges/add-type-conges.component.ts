import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminRHServiceService } from '../../service/admin-rhservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-type-conges',
  imports: [ReactiveFormsModule],
  templateUrl: './add-type-conges.component.html',
  styleUrl: './add-type-conges.component.css'
})
export class AddTypeCongesComponent {
      AddTypeCForm!: FormGroup;
      errorMessage: string = '';
      token=localStorage.getItem('token');
    
      constructor(
        private fb: FormBuilder,
        private adminRhService: AdminRHServiceService,
        private router: Router
      ) {
        this.AddTypeCForm = this.fb.group({
          nomTypeConge: [''],
          descriptionC: [''],
          affecteSoldeConge : ['false']
        });
      }
    
      ngOnInit(): void {
        
      }
      
    
      onSubmit(): void {
        const Data = this.AddTypeCForm.value;
        if(this.token){
        this.adminRhService.createTypeConges(Data,this.token).subscribe({
          next: () => {
            this.router.navigate(['/adminRH/typeConges']); // Redirection après ajout
          },
          error: (error) => {
            this.showError('Une erreur est survenue lors de l\'ajout du Type Conges , '+error)
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
