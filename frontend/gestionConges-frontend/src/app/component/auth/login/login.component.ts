import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { ServiceService } from '../../shared/service.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login!: FormGroup;
  errorMessage: string = ''; 
  constructor(private fb: FormBuilder,
              private authService: ServiceService,
              private router: Router) {
    // Initialisation du formulaire
    this.login = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  loginUser(login: FormGroup) {
    this.authService.login(login.value.email, login.value.password).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          this.redirectUser(response.role);
        } else {
          this.showError(response.message);
        }
      },
      error: (error) => {
        this.showError(error.message);
      },
    });
  }

  redirectUser(role: string) {
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin']).then(() => { window.location.reload(); });
        break;
      case 'AdminRH':
        this.router.navigate(['/adminRH']).then(() => { window.location.reload(); });
        break;
      case 'Manager':
        this.router.navigate(['/manager']).then(() => { window.location.reload(); });
        break;
      case 'User':
        this.router.navigate(['/employee']).then(() => { window.location.reload(); });
        break;
      default:
        this.router.navigate(['/login']).then(() => { window.location.reload(); });
    }
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000);
  }
}
