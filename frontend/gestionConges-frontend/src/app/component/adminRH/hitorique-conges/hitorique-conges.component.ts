import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminRHServiceService } from '../../adminRH/service/admin-rhservice.service';
import { ServiceService } from '../../shared/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hitorique-conges',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './hitorique-conges.component.html',
  styleUrls: ['./hitorique-conges.component.css']
})
export class HitoriqueCongesComponent implements OnInit {
  departements: any[] = [];
  filteredDepartements: any[] = [];
  token = localStorage.getItem("token");
  employeeForm: FormGroup;

  constructor(
    private adminRHService: AdminRHServiceService,
    private fb: FormBuilder,
    private sharedService: ServiceService
  ) {
    this.employeeForm = this.fb.group({
      departement: [''] // Form control for filtering
    });
  }

  ngOnInit(): void {
    if (this.token) {
      this.sharedService.getAllDepartements().subscribe({
        next: (data) => {
          console.log("Departements data:", data);
          this.departements = data;
          this.filteredDepartements = data; // Initially, all departments are shown

          const managerRequests = data.map(departement => {
            if (!departement.idDep) {
              console.error('Invalid department id:', departement);
              return of(null);
            }
            return this.adminRHService.getManagerByDepId(departement.idDep, this.token!).pipe(
              map((manager: any) => ({ departement, manager }))
            );
          });

          forkJoin(managerRequests).subscribe({
            next: (results) => {
              this.departements = results
                .filter((result: any) => result !== null)
                .map((result: any) => ({
                  ...result.departement,
                  manager: result.manager
                }));

              const demandeRequests = results.map((result: any) => {
                if (!result.manager.id) {
                  console.error('Invalid manager id:', result);
                  return of(null);
                }
                return this.adminRHService.getAllDemandeByManagerId(result.manager.id, this.token!).pipe(
                  map((demandes: any) => ({
                    departement: result.departement,
                    manager: result.manager,
                    demandes
                  }))
                );
              });

              forkJoin(demandeRequests).subscribe({
                next: (demandesResults) => {
                  console.log("Demandes results:", demandesResults);
                  this.departements = demandesResults
                    .filter((result: any) => result !== null)
                    .map((result: any) => ({
                      ...result.departement,
                      manager: {
                        ...result.manager,
                        demandes: result.demandes
                      }
                    }));
                  this.filteredDepartements = this.departements; // Update filtered list after loading all data
                },
                error: (error) => { console.error("Erreur lors du chargement des demandes", error); }
              });
            },
            error: (error) => { console.error("Erreur lors du chargement des managers.", error); }
          });
        },
        error: (error) => { console.error("Erreur lors du chargement des départements.", error); }
      });
    }
  }

  filterDepartement(): void {
    const selectedDep = this.employeeForm.get('departement')?.value;
    if (selectedDep) {
      this.filteredDepartements = this.departements.filter(dep => dep.nomDep === selectedDep);
    } else {
      this.filteredDepartements = this.departements;
    }
  }
}
