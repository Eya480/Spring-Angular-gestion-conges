import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminRHServiceService } from '../../service/admin-rhservice.service';

@Component({
  selector: 'app-list-type-conges',
  imports: [RouterModule],
  templateUrl: './list-type-conges.component.html',
  styleUrl: './list-type-conges.component.css'
})
export class ListTypeCongesComponent {
    typeConges? : any [];
    token = localStorage.getItem("token");
  
    constructor(private adminRhService : AdminRHServiceService){}
  
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
  
    deleteTypesConges(id: string | undefined): void {
      if (id && this.token) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce Type Conges ?')) {
          this.adminRhService.deleteTypeC(id,this.token).subscribe({
            next: (data) => {
              //console.log('Réponse de suppression :', data)
              this.typeConges = this.typeConges?.filter(t => t.idTypeConge !== id);
            },
            error: (error) => console.error('Erreur lors de la suppression du Type', error)
          });
        }
      } else {
        console.error('ID du Type est undefined');
      }
    }
}
