import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeServiceService } from '../../service/employee-service.service';
import { CommonModule } from '@angular/common';
import { AdminRHServiceService } from '../../../adminRH/service/admin-rhservice.service';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lister-demande',
  imports: [RouterModule,CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './lister-demande.component.html',
  styleUrl: './lister-demande.component.css'
})
export class ListerDemandeComponent {
      demandeConges? : any [];
      typeConges? : any[];
      originalListe? : any[];
      token = localStorage.getItem("token");
      errorMessage: string = '';
      typeForm: FormGroup;
      selectedId?: string;
          
      @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
      
      openDeleteModal(id: string): void {
            this.selectedId = id;
            this.modelService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title' });
      }
    
      constructor(private employeService : EmployeeServiceService,private TypeCService : AdminRHServiceService,private fb: FormBuilder,private modelService:NgbModal){
        this.typeForm = this.fb.group({
          type: [''],
        });
      }
    
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
        });
      }
      this.typeForm?.get('type')?.valueChanges.subscribe(value => {
        this.filterByType(value);
      });
    
      }


      filterByType(type: string): void {
        if (type) {
          this.demandeConges = this.originalListe!.filter(e => e.typeConge.nomTypeConge==type);
        } else {
          this.demandeConges = [...this.originalListe!];
        }
      }
    
      deleteDemande(id: string | undefined, modal: any): void {
        if (id && this.token) {
                this.employeService.deleteDemande(id, this.token).subscribe({
                    next: (data) => {
                        console.log(data);
                        this.demandeConges = this.demandeConges?.filter(t => t.idDemande !== id); 
                        modal.close('Close click');
                    },
                    error: (error) => {
                        if (error.status === 403) {
                            this.showError('La demande de congé ne peut être supprimée que si elle est en attente.');
                        } else {
                            console.error('Erreur lors de la suppression de la demande', error);

                        }
                    }
                });
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

    
    
    
      
}
