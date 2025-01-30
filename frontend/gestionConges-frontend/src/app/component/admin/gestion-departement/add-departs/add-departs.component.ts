import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminServiceService } from '../../service/admin-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-departs',
  imports: [ReactiveFormsModule],
  templateUrl: './add-departs.component.html',
  styleUrl: './add-departs.component.css'
})
export class AddDepartsComponent {
    AddDepForm!: FormGroup;
    errorMessage: string = '';
    token=localStorage.getItem('token');
  
    constructor(
      private fb: FormBuilder,
      private adminService: AdminServiceService,
      private router: Router
    ) {
      this.AddDepForm = this.fb.group({
        nomDep: [''],
        description: [''],
      });
    }
  
    ngOnInit(): void {
      
    }
    
  
    onSubmit(): void {
      const Data = this.AddDepForm.value;
      if(this.token){
      this.adminService.createDep(Data,this.token).subscribe({
        next: () => {
          this.router.navigate(['/admin/departement']); // Redirection après ajout
        },
        error: (error) => {
          this.showError('Une erreur est survenue lors de l\'ajout de département , '+error)
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
