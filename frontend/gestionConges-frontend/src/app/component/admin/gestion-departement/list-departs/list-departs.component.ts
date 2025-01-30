import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminServiceService } from '../../service/admin-service.service';
import { ServiceService } from '../../../shared/service.service';

@Component({
  selector: 'app-list-departs',
  imports: [RouterModule],
  templateUrl: './list-departs.component.html',
  styleUrl: './list-departs.component.css'
})
export class ListDepartsComponent implements OnInit{
  
  departements? : any [];
  token = localStorage.getItem("token");

  constructor(private sharedService : ServiceService, private adminService : AdminServiceService){}

  ngOnInit(): void {
    this.sharedService.getAllDepartements().subscribe({
      next: (data) => {
        this.departements = data; 
      },
      error: (error) => {
        console.error ("Erreur lors du chargement des départements.");
      }
    });

  }

  deleteDep(id: string | undefined): void {
    if (id && this.token) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce Département ?')) {
        this.adminService.deleteDep(id,this.token).subscribe({
          next: (data) => {
            //console.log('Réponse de suppression :', data)
            this.departements = this.departements?.filter(dep => dep.idDep !== id);
          },
          error: (error) => console.error('Erreur lors de la suppression du departement', error)
        });
      }
    } else {
      console.error('ID du departement est undefined');
    }
  }


}
