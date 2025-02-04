import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private basic_url="http://localhost:8080";
  
  constructor(private http: HttpClient, private router: Router) { }

  deleteDep(id: string, token: string): Observable<any> {
    const url = `${this.basic_url}/api/departements/delete-dep/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Supprimez l'espace après 'Authorization'
    });
    return this.http.delete<any>(url, { headers});
  }

  createDep(departData: any, token: string): Observable<any> {
    const url = `${this.basic_url}/api/departements`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(url, departData, {headers}); 
  }
  createUser(User: any, token: string): Observable<any> {
    const url = `${this.basic_url}/admin/createUser`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(url, User, {headers}); 
  }
  //users

  getAllUsers(token : string): Observable<any>{
    const url = `${this.basic_url}/admin/get-all-users`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  getUserById(id : string , token: string): Observable<any>{
    const url = `${this.basic_url}/admin/getUserById/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  getManagerByDepId(id : string , token: string): Observable<any>{
    const url = `${this.basic_url}/api/adminAdminRH/Manager/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  updateUser(id: string, user: any, token : string): Observable<any> {
    const url = `${this.basic_url}/admin/modifierUser/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(url, user,{headers});
  }

  updateRole(id: string, newRole: any, nomDep: string, token: string): Observable<any> {
    const url = `${this.basic_url}/admin/modifierRole/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const params = new HttpParams().set('nomDep', nomDep);
    
    // S'assurer que le corps envoyé est un objet JSON valide
    const body = JSON.stringify(newRole);
    
    return this.http.put<any>(url, body, { headers, params });
  }    
  

  deleteUser(id: string, token : string): Observable<any> {
    const url = `${this.basic_url}/admin/deleteUser/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(url,{headers});
  }

}
