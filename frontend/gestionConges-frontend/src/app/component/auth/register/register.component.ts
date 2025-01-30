import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ServiceService } from '../../shared/service.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage: string = '';
  successMessage : string = '';
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
  departements: string[] = [
    'Développement',
    'Cybersécurité',
    'Gestion des Projets',
    'Administration Systèmes',
    'Services Cloud',
    'Ressources Humaines',
    'Développement Logiciel',
    'Infrastructure et Réseaux',
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: ServiceService,private departementService: ServiceService
  ) {
    this.registerForm = this.fb.group({
      nom: [''],
      prenom: [''],
      email: [''], 
      CIN: [''],
      tel: [''],
      nomDep: [''],
      dateEmbauche: [''],
      poste: [''],
      pwd: [''],
      role: ['User'],
  });
  }  
      
    onSubmit(): void {
      const formData = this.registerForm.value;
      // Adjust the structure to match backend expectations
      const dataToSend = {
        CIN: formData.cin,
        nom: formData.nom,
        prenom: formData.prenom,
        tel: formData.tel,
        email: formData.email,
        pwd: formData.pwd,
        role: formData.role,
        departement: {
       nomDep: formData.nomDep
    },
      dateEmbauche: formData.dateEmbauche,  // Format the date correctly
      poste: formData.poste
  };

    //console.log('Form Data:', this.registerForm.value);
    this.authService.register(dataToSend).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.showSuccess('Inscription réussie ! Redirection vers la page de connexion...');
          this.router.navigate(['/login']).then(() => window.location.reload());
        } else {
          this.showError(response.message || 'Une erreur est survenue');
        }
      },
      error: (error) => {
        console.log(error);
        this.showError(error.message || 'Une erreur inconnue est survenue');
      },
    });

    }
    showError(mess: string) {
      this.errorMessage = mess;
      setTimeout(() => {
        this.errorMessage = ''
      }, 3000)
    }
    showSuccess(message: string): void {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = ''; // Clear success message after 2 seconds
      }, 2000);
    }
  
    }
  