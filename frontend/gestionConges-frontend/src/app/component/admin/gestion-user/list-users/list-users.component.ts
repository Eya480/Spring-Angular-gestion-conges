import { Component ,TemplateRef, ViewChild } from '@angular/core';
import { AdminServiceService } from '../../service/admin-service.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../../../shared/service.service';
import { departements } from '../../../../interfaces/departementsInt';



@Component({
  selector: 'app-list-users',
  imports: [RouterModule,CommonModule, FormsModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent {
  users? : any [];
  adminRHExists?:boolean=false;
  token = localStorage.getItem("token");
  errorMessage: string = '';
  departements?: departements[];
  filteredUsers?: any[] = [];
  roles?: string[] = ['Tous', 'Manager', 'User', 'AdminRH'];
  rolesAv?:string[]=['Manager','User']
  selectedRole?: string = 'Tous';
  selectedId?: string;
  
    // Déclarez une référence au template du modal
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  
  constructor(private adminService : AdminServiceService, private modalService : NgbModal, private sharedService: ServiceService){}

  

  ngOnInit(): void {
    if (this.token) {
      this.adminService.getAllUsers(this.token).subscribe({
        next: (data) => {
          this.users = data.personnelList.filter((u: any) => u.role !== 'Admin') || [];
          if (this.users?.some((user: any) => user.role === 'AdminRH')) {
            this.adminRHExists = true;
          }
          //console.log(this.adminRHExists);
          this.filterUsers();
        },
        error: () => {
          console.error("Erreur lors du chargement des users.");
        }
      });

      this.sharedService.getAllDepartements().subscribe({
        next: (data) => {
          this.departements = data; 
        },
        error: () => {
          this.errorMessage = "Erreur lors du chargement des départements.";
        }
      });
    }
  }
  
  
        
        deleteUser(id: string | undefined, modal:any): void {
          if (id && this.token) {
                  this.adminService.deleteUser(id, this.token).subscribe({
                      next: (data) => {
                          console.log(data);
                          this.filteredUsers = this.filteredUsers?.filter(u => u.id !== id);  // Remove request from the list
                          modal.close('Close click');
                      },  
                      error: (error) => {
                              console.error('Erreur lors de la suppression de l\'user', error);
                  
                      }
                  });
          } else {
              console.error('ID de User est undefined');
          }
      }
      
        
      showError(mess: string) {
        this.errorMessage = mess;
        setTimeout(() => {
          this.errorMessage = ''
        }, 3000)
      }
      selectRole(role: string): void {
        this.selectedRole = role;
        this.filterUsers();
      }
      filterUsers(): void {
        if (!this.users) return;
        if (this.selectedRole === 'Tous') {
          this.filteredUsers = this.users;
        } else {
          this.filteredUsers = this.users?.filter(user => user.role === this.selectedRole);
        }
      }


      //MODELS
       /*
      openRoleModal( modalRef: TemplateRef<any>): void {
        // Créer une copie de l'utilisateur et initialiser newRole avec le rôle actuel
        this.modalService.open(modalRef, { centered: true });
      }
        */
      
      openModal(content: TemplateRef<any>) {
        this.modalService.open(content, { centered: true });
      }

      openDeleteModal(id: string): void {
        this.selectedId = id;
        this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title' });
      }
      /*
      updateUserRole(userId: string, newRole: string,nomDep : string): void{
            if (this.token) {        
              this.adminService.updateRole(userId, newRole,nomDep,this.token)
                .subscribe({
                  next: () =>{},
                  error: () => {
                    this.errorMessage = 'Une erreur est survenue lors de la mise à jour de Role de User.';
                  }
                });
            }
          }
            */
      }

  
      
  
      
      
