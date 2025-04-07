import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../../service/admin-service.service';
import { ServiceService } from '../../../shared/service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { departements } from '../../../../interfaces/departementsInt';

@Component({
  selector: 'app-edit-user',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  user: any = {}; 
  errorMessage: string = '';
  role? : string;
  firstDepSelected? : string;
  departements: departements[] = [];
  postes: string[] = [
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
  roles: string[] = [];
  token = localStorage.getItem('token'); 

  constructor(
    private activeRoute: ActivatedRoute,
    private UserService: AdminServiceService,
    private sharedService : ServiceService,
    private router: Router,
    private modelService : NgbModal
  ) {}

  istheDepHasManager(event: Event, content: TemplateRef<any>): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
  
    // Trouver le département sélectionné dans la liste des départements
    const Dep = this.departements.find((d) => d.nomDep === selectedValue);
  
    //console.log(Dep);
    
    if (this.token) {
      // Vérification si le département a déjà un manager
      this.UserService.getManagerByDepId(Dep?.idDep!, this.token).subscribe({
        next: (data) => {

          if (data != null) {
            // Si un manager existe, ouvrir le modal
            const modalRef = this.modelService.open(content, { centered: true });
            modalRef.result.finally(() => {
              // Réinitialisation de la valeur du département uniquement après la fermeture du modal
              selectElement.value =this.firstDepSelected ?? '';
            });
          }
        },
        error: () => {
          this.errorMessage = "Erreur lors de la récupération du manager.";
        }
      });
    }
  }
  
  

  // Méthode pour éditer un employé
  editUser(f: NgForm) {
    if (this.token) {
    if (f.valid) {
      const dataToSend = {
        nom: this.user.nom,
        prenom: this.user.prenom,
        tel: this.user.tel,
        email: this.user.email,
        pwd: this.user.pwd,
        departement: {
          nomDep: this.user.departement.nomDep,
        },
        dateEmbauche: this.user.dateEmbauche,  
        poste: this.user.poste,
      };

      this.UserService.updateUser(this.user.id!, dataToSend,this.token)
        .subscribe({
          next: () => this.router.navigate(['/admin/users']),
          error: () => {
            this.errorMessage = 'Une erreur est survenue lors de la mise à jour de User.';
          }
        });
    } 
  }}

  // Récupérer l'employé à éditer lors de l'initialisation
  ngOnInit(): void {
    this.roles=['User','AdminRH','Manager']
    
    this.sharedService.getAllDepartements().subscribe({
      next: (data) => {
        this.departements = data; // Just get names
      },
      error: (error) => {
        this.errorMessage = "Erreur lors du chargement des départements.";
      }
    });

    this.activeRoute.params.subscribe({
      next: (params) => {
        const id = params['id']; 
        if (id && this.token) {
          this.UserService.getUserById(id, this.token).subscribe({
            next: (userData) => {

              if(userData.role!='AdminRH'){this.firstDepSelected= userData.departement.nomDep;}

              this.user = userData;
              console.log(userData)
              this.role=userData.role;
            },
            error: (error) => {
              console.error('Erreur lors de la récupération des données :', error); 
            },
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des paramètres :', error); 
      },
    });
  }
  
}  