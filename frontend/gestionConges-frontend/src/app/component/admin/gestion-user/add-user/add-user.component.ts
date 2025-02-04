import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminServiceService } from '../../service/admin-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../../shared/service.service';
import { CommonModule } from '@angular/common';
import { departements } from '../../../../interfaces/departementsInt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit {
  addUser!: FormGroup;
  errorMessage: string = '';
  departements: departements[] = []; // List of available departments
  postes: string[] = [];
  token=localStorage.getItem('token');
  selectedRole: string | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private route : ActivatedRoute,
    private router: Router
    ,private sharedService : ServiceService,
    private modelService : NgbModal
  ) {
    this.addUser = this.fb.group({
      cin: [''], 
      nom: [''],
      prenom: [''],
      tel: [''], 
      email: [''],
      pwd: [''],
      role: [''],
      nomDep: [''],
      dateEmbauche: [''], 
      poste: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedRole = params['role'];
      if (this.selectedRole) {
        this.addUser.patchValue({ role: this.selectedRole });
      }
    });

    this.sharedService.getAllDepartements().subscribe({
      next: (data) => {
        // If the backend returns objects with nomDep, just extract the names
        this.departements = data; // Just get names
      },
      error: (error) => {
        this.errorMessage = "Erreur lors du chargement des départements.";
      }
    });
  
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
  }

  istheDepHasManager(event: Event, content : TemplateRef<any>): void{
    const selectElement = event.target as HTMLSelectElement; // Assertion du type pour accéder à la valeur
    const selectedValue = selectElement.value;
    const DepId = this.departements.find((d) => d.nomDep === selectedValue)?.idDep;
    if (this.token)
    this.adminService.getManagerByDepId(DepId!,this.token).subscribe({
      next: (data) => {
        if(data != null){
          const modalRef=this.modelService.open(content,{centered : true});
          modalRef.result.finally(()=>{
            selectElement.value="";
          })
          
        }
      },
      error: (error) => {
        this.errorMessage = "Erreur lors du la recuperation du manager.";
      }
    });
    
  }
  
  

  onSubmit(): void {
    const formData = this.addUser.value;
      // Adjust the structure to match backend expectations
      const dataToSend = {
        CIN: formData.cin,
        nom: formData.nom,
        prenom: formData.prenom,
        tel: formData.tel,
        email: formData.email,
        pwd: formData.pwd,
        role: formData.role,
        departement: {nomDep: formData.nomDep},
        dateEmbauche: formData.dateEmbauche,  // Format the date correctly
        poste: formData.poste
  };
    if(this.token){
    this.adminService.createUser(dataToSend,this.token).subscribe({
      next: (data) => {
        if (data.statusCode === 200){
        this.router.navigate(['/admin/users']); // Redirection après ajout
      }else{
        this.showError(data.message || 'Une erreur est survenue');
      }
    },
      error: (error) => {
        this.showError('Une erreur est survenue lors de l\'ajout de l\'user , '+error.message)
      }
    });
  }}
  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }
}
