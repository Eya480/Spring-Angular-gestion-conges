import { Component, OnInit } from '@angular/core';
import { ManagerServiceService } from '../../service/manager-service.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-demandes-en-attente',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './demandes-en-attente.component.html',
  styleUrl: './demandes-en-attente.component.css'
})
export class DemandesEnAttenteComponent implements OnInit{
  postes:string[]=[];
  poste: string = 'all';
  LesDemandes? : any[];
  nbJours? : number;
  originalList?: any[];
  errorMessage: string = '';
  token = localStorage.getItem('token'); 

  constructor(private managerService: ManagerServiceService){}

  ngOnInit(): void {
    this.postes = [
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
    
  if (this.token) {
    this.managerService.getAllDemandeEquipe(this.token).subscribe({
      next: (data: any[]) => {
        // Filtrer les demandes en attente
        const demandesEnAttente = data.filter((d) => d.statut === 'En_Attente');

        // Préparer les requêtes pour récupérer les employés
        const demandesAvecEmploye$ = demandesEnAttente.map((demande) =>
          this.managerService.getEmployeByDemandeConge(this.token!, demande.idDemande).pipe(
            map((employe : any) => ({
              ...demande,
              nbJours: this.calculateDays(demande.dateDebut, demande.dateFin),
              employe,
            }))
          )
        );

        forkJoin(demandesAvecEmploye$).subscribe({
          next: (result) => {
            this.LesDemandes = result;
            this.originalList = [...this.LesDemandes]; // Conserver la liste originale
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des employés :', err);
          },
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des demandes :', err);
      },
    });
  }
}

  //validation
  approuverDemande(id: string): void {
    if (id && this.token) {
      this.managerService.approuverDemande(id,this.token).subscribe({
        next: (data) => {
          // Filtrer les demandes pour ne garder que celles en attente
          this.LesDemandes = this.LesDemandes?.filter((d)=>d.statut === 'En_Attente');
          //console.log(data.message);
        },
        error: (err) => {
          console.error('Erreur lors de l\'approbation de la demande :', err);
        },
      });
    } else {
      console.error('Aucun ID ou token valide trouvé pour approuver la demande.');
    }
}

refuserDemande(id: string): void {
    if (id && this.token) {
      this.managerService.refuserDemande(id,this.token).subscribe({
        next: (data) => {
          // Filtrer les demandes pour ne garder que celles en attente
          this.LesDemandes = this.LesDemandes?.filter((d)=>d.statut === 'En_Attente');
          console.log(data.message);
        },
        error: (err) => {
          console.error('Erreur lors du refus de la demande :', err);
        },
      });
    } else {
      console.error('Aucun ID ou token valide trouvé pour refuser la demande.');
    }
}

  

  // Filtrer par département
  filter(): void {
    if (this.poste !== 'all') {
      this.LesDemandes = this.originalList?.filter(
        (d) => d.employe.poste === this.poste
      );
    } else {
      this.resetFilter();
    }
  }

  // Réinitialiser les filtres
  resetFilter(): void {
    this.LesDemandes = [...(this.originalList || [])]; // Restaurer la liste originale
    this.poste = 'all'; // Réinitialiser la sélection
  }

  calculateDays(dateDebut: string, dateFin: string): number {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
  
    const timeDiff = fin.getTime() - debut.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Ajoutez 1 pour inclure le jour de début et de fin
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }
  
  

}
