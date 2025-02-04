import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminRHServiceService } from '../../service/admin-rhservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-type-conges',
  imports: [RouterModule],
  templateUrl: './list-type-conges.component.html',
  styleUrl: './list-type-conges.component.css'
})
export class ListTypeCongesComponent {
    typeConges? : any [];
    token = localStorage.getItem("token");
    selectedId?: string;
    
    @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

    openDeleteModal(id: string): void {
      this.selectedId = id;
      this.modelService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title' });
    }

  
    constructor(private adminRhService : AdminRHServiceService,private modelService:NgbModal){}
  
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
  
    deleteTypesConges(id: string | undefined,modal:any): void {
      if (id && this.token) {
          this.adminRhService.deleteTypeC(id,this.token).subscribe({
            next: () => {
              this.typeConges = this.typeConges?.filter(t => t.idTypeConge !== id);
              modal.close('Close click');
            },
            error: (error) => console.error('Erreur lors de la suppression du Type', error)
          });
      } else {
        console.error('ID du Type est undefined');
      }
    }
}
