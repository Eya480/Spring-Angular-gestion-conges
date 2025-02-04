import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminServiceService } from '../../service/admin-service.service';
import { ServiceService } from '../../../shared/service.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-departs',
  imports:[RouterModule],
  templateUrl: './list-departs.component.html',
  styleUrls: ['./list-departs.component.css']
})
export class ListDepartsComponent implements OnInit {
  departements?: any[];
  token = localStorage.getItem("token");
  selectedDepId?: string;

  // Déclarez une référence au template du modal
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  constructor(private sharedService: ServiceService, private adminService: AdminServiceService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.sharedService.getAllDepartements().subscribe({
      next: (data) => {
        this.departements = data;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des départements.");
      }
    });
  }

  openDeleteModal(depId: string): void {
    this.selectedDepId = depId;
    this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  deleteDep(id: string | undefined, modal: any): void {
    if (id && this.token) {
      this.adminService.deleteDep(id, this.token).subscribe({
        next: (data) => {
          this.departements = this.departements?.filter(dep => dep.idDep !== id);
          modal.close('Close click');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du département', error);
          modal.close('Close click');
        }
      });
    } else {
      console.error('ID du département est undefined');
      modal.close('Close click');
    }
  }
}
