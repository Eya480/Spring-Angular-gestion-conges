import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeServiceService } from '../../../employee/service/employee-service.service';
import { AdminRHServiceService } from '../../service/admin-rhservice.service';
import { ServiceService } from '../../../shared/service.service';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  AddEmployeeForm!: FormGroup;
  errorMessage: string = '';
  departements: string[] = []; // List of available departments
  postes: string[] = [];
  token=localStorage.getItem('token');

  constructor(
    private fb: FormBuilder,
    private employeeService: AdminRHServiceService,
    private router: Router
    ,private sharedService : ServiceService
  ) {
    this.AddEmployeeForm = this.fb.group({
      cin: [''], 
      nom: [''],
      prenom: [''],
      tel: [''], 
      email: [''],
      pwd: [''],
      role: ['User'],
      nomDep: [''],
      dateEmbauche: [''], 
      poste: ['']
    });
  }

  ngOnInit(): void {
    this.sharedService.getAllDepartements().subscribe({
      next: (data) => {
        // If the backend returns objects with nomDep, just extract the names
        this.departements = data.map(departement => departement.nomDep); // Just get names
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
  

  onSubmit(): void {
    const formData = this.AddEmployeeForm.value;
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
    this.employeeService.register(dataToSend,this.token).subscribe({
      next: (data) => {
        if (data.statusCode === 200){
        this.router.navigate(['/adminRH/employees']); // Redirection après ajout
      }else{
        this.showError(data.message || 'Une erreur est survenue');
      }
    },
      error: (error) => {
        this.showError('Une erreur est survenue lors de l\'ajout de l\'employé , '+error.message)
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
