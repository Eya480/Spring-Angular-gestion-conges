import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeServiceService } from '../../service/employee-service.service';
import { CommonModule } from '@angular/common';
import { AdminRHServiceService } from '../../../adminRH/service/admin-rhservice.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lister-demande',
  imports: [RouterModule,CommonModule, FormsModule],
  templateUrl: './lister-demande.component.html',
  styleUrl: './lister-demande.component.css'
})
export class ListerDemandeComponent {
      demandeConges? : any [];
      typeConges ? : any[];
      type: string = "all";
      originalListe ? : any[];
      token = localStorage.getItem("token");
      errorMessage: string = '';
    
      constructor(private employeService : EmployeeServiceService,private TypeCService : AdminRHServiceService){}
    
      ngOnInit(): void {
        if(this.token){
        this.employeService.getAllDemande(this.token).subscribe({
          next: (data) => {
            //console.log(data)
            this.originalListe = [...data];
            this.demandeConges = data; 
          },
          error: () => {
            console.error ("Erreur lors du chargement des demandes.");
          }
        });
        this.TypeCService.getAllTypeC(this.token).subscribe({
          next: (data)=>{this.typeConges=data},
          error:()=>{console.error ("Erreur lors du chargement des type Conges.");}
        })
      }
    
      }
    
      deleteDemande(id: string | undefined): void {
        if (id && this.token) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
                this.employeService.deleteDemande(id, this.token).subscribe({
                    next: (data) => {
                        console.log(data);
                        this.demandeConges = this.demandeConges?.filter(t => t.idDemande !== id);  // Remove request from the list
                    },
                    error: (error) => {
                        if (error.status === 403) {
                            this.showError('La demande de congé ne peut être supprimée que si elle est en attente.');
                        } else {
                            console.error('Erreur lors de la suppression de la demande', error);
                        }
                    }
                });
            }
        } else {
            console.error('ID de demande est undefined');
        }
    }
    showError(mess: string) {
      this.errorMessage = mess;
      setTimeout(() => {
        this.errorMessage = ''
      }, 3000)
    }

    toggleRaison(id: number) {
      const demande = this.demandeConges?.find(d => d.idDemande === id);
      if (demande) {
        demande.showRaison = !demande.showRaison;
      }
    }

    filter(): void {
      if (this.type !== 'all') {
        this.demandeConges = this.originalListe?.filter(
          (e) => e.typeConge.nomTypeConge === this.type
        );
      } else {
        this.resetFilter();
      }
    }
    
    resetFilter(): void {
      this.demandeConges = [...(this.originalListe || [])];
      this.type = 'all';
    }
    
    
    
      
}
