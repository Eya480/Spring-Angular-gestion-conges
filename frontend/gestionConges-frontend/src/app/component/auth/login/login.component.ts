import { Component } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { ServiceService } from '../../shared/service.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login!: FormGroup;
  errorMessage: string = ''; 
  constructor(private fb:FormBuilder,
    private authService : ServiceService,private router: Router){
     // Initialisation du formulaire
     this.login = this.fb.group({
      email: [''],
      password: ['']
    });
  }
  loginUser(login: FormGroup) {
    this.authService.login(login.value.email, login.value.password).subscribe({
      next: (response) => {
        //console.log(response);
        if (response.statusCode === 200) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          this.router.navigate(['/profile']).then(() => {
            window.location.reload();
        });
          } else {
          this.showError(response.message);
        }
      },
      error: (error) => {
        this.showError(error.message);
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
