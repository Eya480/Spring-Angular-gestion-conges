import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminRHServiceService } from '../../service/admin-rhservice.service';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../shared/service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-employee',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css'],
})
export class ListEmployeeComponent implements OnInit {
  employees?: any[]; // Liste filtrée
  originalEmployees?: any[]; // Liste complète
  departements?: string[] = []; 
  employeeForm: FormGroup;
  token = localStorage.getItem('token'); 
  selectedId?: string;

  constructor(
    private adminRhService: AdminRHServiceService,
    private router: Router,
    private sharedService: ServiceService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.employeeForm = this.fb.group({
      departement: [''],
    });
  }

  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  openDeleteModal(id: string): void {
    this.selectedId = id;
    this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title' });
  }

   
  ngOnInit(): void {
    // Charger les départements
    this.sharedService.getAllDepartements().subscribe({
      next: (data) => {
        this.departements = data.map((departement) => departement.nomDep); // Récupérer uniquement les noms
      },
      error: () => console.error('Erreur lors du chargement des départements.'),
    });

    // Lorsque le département change, filtrer les employés
    this.employeeForm.get('departement')?.valueChanges.subscribe(value => {
      this.filterByDep(value);
    });

    // Charger les employés si le token est valide
    if (this.token) {
      this.loadEmployees();
    } else {
      console.error('Token introuvable dans le localStorage');
      this.router.navigate(['/login']);
    }
  }

  filterByDep(dep: string): void {
    if (dep) {
      this.employees = this.originalEmployees?.filter(e => e.departement.nomDep === dep);
    } else {
      this.employees = [...this.originalEmployees!]; // Réinitialiser si aucun département n'est sélectionné
    }
  }

  // Charger tous les employés
  loadEmployees(): void {
    this.adminRhService.getAllEmp(this.token!).subscribe({
      next: (data) => {
        this.employees = data;
        this.originalEmployees = [...data]; // Conserver une copie de la liste originale
      },
      error: (error) => console.error('Erreur lors du chargement des employés', error),
    });
  }

  // Supprimer un employé
  deleteEmployee(id: string | undefined, modal:any): void {
    if (id) {
        this.adminRhService.deleteEmployee(id, this.token!).subscribe({
          next: (data) => {
            console.log(data);
            this.employees = this.employees?.filter((c) => c.id !== id); 
            modal.close('Close click');
          },
          error: (error) =>
            console.error('Erreur lors de la suppression de l\'employé', error),
        });
    } else {
      console.error('ID de l\'employé est undefined');
    }
  }
}
