import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ManagerServiceService } from '../../service/manager-service.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { AdminRHServiceService } from '../../../adminRH/service/admin-rhservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-demandes-en-attente',
  imports: [RouterModule, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './demandes-en-attente.component.html',
  styleUrl: './demandes-en-attente.component.css'
})
export class DemandesEnAttenteComponent implements OnInit{
  postes: string[] = [];
  LesDemandes?: any[] = [];
  originalList: any[] = [];
  posteForm: FormGroup;
  token = localStorage.getItem('token'); 
  selectedIdR?: string;
  selectedIdA?: string;

      
  @ViewChild('ApprouveModal') ApprouveModal!: TemplateRef<any>;
  @ViewChild('RefuseModal') RefuseModal!: TemplateRef<any>;


  constructor(private managerService: ManagerServiceService,private fb: FormBuilder, private adminRhService: AdminRHServiceService, private modelService:NgbModal) {
      this.posteForm = this.fb.group({
        poste: [''],
      });
    }
  toggleRaison(id: number) {
    const demande = this.LesDemandes?.find(d => d.idDemande === id);
    if (demande) {
      demande.showRaison = !demande.showRaison;
    }
  }

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
  // Subscribe to form value changes for filtering
  this.posteForm?.get('poste')?.valueChanges.subscribe(value => {
    this.filterByPoste(value);
  });
}

filterByPoste(poste: string): void {
  if (poste) {
    // Filter the requests based on the selected poste
    this.LesDemandes = this.originalList.filter(d => d.employe.poste === poste);
  } else {
    // If no poste is selected, display all requests
    this.LesDemandes = [...this.originalList];
  }
}

  //validation
  approuverDemande(id: string, model:any): void {
    if (id && this.token) {
      this.managerService.approuverDemande(id,this.token).subscribe({
        next: () => {
          // Filtrer les demandes pour ne garder que celles en attente
          this.LesDemandes = this.LesDemandes?.filter((d)=>d.idDemande != id);
          model.close('Close click')
        },
        error: (err) => {
          console.error('Erreur lors de l\'approbation de la demande :', err);
        },
      });
    } else {
      console.error('Aucun ID ou token valide trouvé pour approuver la demande.');
    }
}

refuserDemande(id: string, model:any): void {
    if (id && this.token) {
      this.managerService.refuserDemande(id,this.token).subscribe({
        next: (data) => {
          // Filtrer les demandes pour ne garder que celles en attente
          this.LesDemandes = this.LesDemandes?.filter((d)=>d.idDemande != id);
          model.close('Close click')
        },
        error: (err) => {
          console.error('Erreur lors du refus de la demande :', err);
        },
      });
    } else {
      console.error('Aucun ID ou token valide trouvé pour refuser la demande.');
    }
}
  openApprouveModal(id: string): void {
    this.selectedIdA = id;
    this.modelService.open(this.ApprouveModal, { ariaLabelledBy: 'modal-basic-title' });
} 
    
  openRefuseModal(id: string): void {
  this.selectedIdR = id;
  this.modelService.open(this.RefuseModal, { ariaLabelledBy: 'modal-basic-title' });
}
  

  

  calculateDays(dateDebut: string, dateFin: string): number {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
  
    const timeDiff = fin.getTime() - debut.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Ajoutez 1 pour inclure le jour de début et de fin
  }
  

}
