import { Component, signal, WritableSignal } from '@angular/core';
import { ManagerServiceService } from '../service/manager-service.service';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRHServiceService } from '../../adminRH/service/admin-rhservice.service';

@Component({
  selector: 'app-historique-demandes',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './historique-demandes.component.html',
  styleUrls: ['./historique-demandes.component.css']
})
export class HistoriqueDemandesComponent {
  demandeConges: any[] = [];
  congesArr: WritableSignal<any[]> = signal([]);
  originalCongesArr: any[] = [];
  nomDep?: String ;
  typeConges? : any [];
  congesForm: FormGroup;
  token = localStorage.getItem("token");

  constructor(private managerService: ManagerServiceService, private fb: FormBuilder, private adminRhService: AdminRHServiceService) {
    this.congesForm = this.fb.group({
      searchInput: [''],
      typeConge: [''],
      dateDebut: ['']
    });
  }
  toggleRaison(id: number) {
      const demande = this.demandeConges?.find(d => d.idDemande === id);
      if (demande) {
        demande.showRaison = !demande.showRaison;
      }
    }
  
  ngOnInit(): void {
    
    if (this.token) {

      this.adminRhService.getAllTypeC(this.token).subscribe({
        next: (data) => {
          this.typeConges = data;
        },
        error: (error) => {
          console.error ("Erreur lors du chargement des types conges.");
        }
      });

      this.managerService.getAllDemandeEquipe(this.token).subscribe({
        next: (data: any[]) => {
          const demandes = data;
  
          const demandesAvecEmploye$ = demandes.map((demande) =>
            this.managerService.getEmployeByDemandeConge(this.token!, demande.idDemande).pipe(
              map((employe: any) => ({
                ...demande,
                employe,
              }))
            )
          );
  
          forkJoin(demandesAvecEmploye$).subscribe({
            next: (demandesAvecEmployes) => {
              this.demandeConges = demandesAvecEmployes;
              this.nomDep = demandesAvecEmployes[0].employe.departement.nomDep;
              this.originalCongesArr = [...this.demandeConges];
              this.congesArr.set(this.demandeConges);
            },
            error: (error) => console.error("Erreur lors de la récupération des employés: ", error)
          });
        },
        error: (error) => console.error("Erreur lors de la récupération des demandes: ", error)
      });
    }
  
    // Filtrage combiné : Nom/Prénom, Type de Congé, et Date de Début
    this.congesForm.valueChanges
      .pipe(
        map((formValues) => {
          const search = formValues.searchInput.trim().toLowerCase();
          const typeConge = formValues.typeConge.trim().toLowerCase();
          const dateDebut = formValues.dateDebut;
  
          return this.originalCongesArr.filter((demande) => {
            const matchNom = `${demande.employe.nom} ${demande.employe.prenom}`.toLowerCase().includes(search);
            const matchType = typeConge ? demande.typeConge.nomTypeConge.toLowerCase().includes(typeConge) : true;
            const matchDate = dateDebut ? demande.dateDebut === dateDebut : true;
  
            return matchNom && matchType && matchDate;
          });
        })
      )
      .subscribe((filtered) => this.congesArr.set(filtered));
  }
  
}  