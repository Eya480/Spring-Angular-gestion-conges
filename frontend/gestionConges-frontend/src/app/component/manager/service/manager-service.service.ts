import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Import HttpClient
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ManagerServiceService {

  private url="http://localhost:8080";
  
  constructor(private http: HttpClient,private router: Router) { }

  getAllDemandeEquipe(token : string): Observable<any>{
    const url = `${this.url}/api/Manager/get-all-demande-by-manager`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  getEmployeByDemandeConge(token : string,id : string): Observable<any>{
    const url = `${this.url}/ManagerAdminRH/get-employe-by-demande/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  refuserDemande(id: string, token: string): Observable<any> {
    const url = `${this.url}/api/Manager/refuser-demande/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<any>(url, { headers }); // Requête GET
}

approuverDemande(id: string, token: string): Observable<any> {
    const url = `${this.url}/api/Manager/approuve-demande/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers }); // Requête GET
}



}
