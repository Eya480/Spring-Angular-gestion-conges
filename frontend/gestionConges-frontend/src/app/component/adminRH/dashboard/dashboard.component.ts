import { Component, OnInit } from '@angular/core';
import { AdminRHServiceService } from '../service/admin-rhservice.service';
import { EmployeeServiceService } from '../../employee/service/employee-service.service';
import { ServiceService } from '../../shared/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports:[CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    departements? : any [];
    employees?: any[];
    refuse? : number=0;
    approuve? : number=0;
    ext? : number=0;
    att? : number=0;
    token = localStorage.getItem("token");
    nbtypeConges ? : number = 0;
  
    constructor(
      private employeService: EmployeeServiceService,
      private sharedService: ServiceService,
      private TypeCService : AdminRHServiceService
    ) {}
  
    ngOnInit(): void {
      if (this.token) {
       
        this.TypeCService.getAllTypeC(this.token).subscribe({
          next: (data)=>{this.nbtypeConges =data.length},
          error:()=>{console.error ("Erreur lors du chargement des type Conges.");}
        });
        this.sharedService.getAllDepartements().subscribe({
          next: (data) => {
            this.departements = data; 
          },
          error: (error) => {
            console.error ("Erreur lors du chargement des départements.");
          }
        });
        this.TypeCService.getAllEmp(this.token!).subscribe({
          next: (data) => {
            this.employees = data;
          },
          error: (error) => console.error('Erreur lors du chargement des employés', error),
        });
      }
      }
    }
  