import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../auth/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileInfo: any;
  errorMessage: string = ''
  constructor(private authService : ServiceService,private router: Router){}
  ngOnInit() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.showError("No Token Found");
      return; // Arrêter l'exécution si aucun token n'est trouvé
    }
  
    this.authService.getProfile(token).subscribe({
      next: (response) => {
        this.profileInfo = response.personnel; // Stocker les informations du profil
      },
      error: (error) => {
        this.showError(error.message); // Afficher l'erreur
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
