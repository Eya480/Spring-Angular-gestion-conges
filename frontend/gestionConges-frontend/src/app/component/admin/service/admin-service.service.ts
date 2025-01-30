import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private basic_url="http://localhost:8080/api/departements";
  
  constructor(private http: HttpClient, private router: Router) { }

  deleteDep(id: string, token: string): Observable<any> {
    const url = `${this.basic_url}/delete-dep/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Supprimez l'espace après 'Authorization'
    });
    return this.http.delete<any>(url, { headers});
  }

  createDep(departData: any, token: string): Observable<any> {
    const url = `${this.basic_url}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(url, departData, {headers}); 
  }

}
