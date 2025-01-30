import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Import HttpClient
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  private url="http://localhost:8080/api/demande-conges";

  constructor(private http: HttpClient,private router: Router) { }

  soumettreDemandeConge(reqData: any, token: string): Observable<any> {
    const url = `${this.url}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(url, reqData, {headers}); 
  }

  getAllDemande(token : string): Observable<any>{
    const url = `${this.url}/get-all`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  getDemandeCongeById(id:string,token : string): Observable<any>{
    const url = `${this.url}/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  updateDemandeConge(idD: string, demande: any, token : string): Observable<any> {
    const url = `${this.url}/modifierDemande/${idD}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(url, demande,{headers});
  }

  deleteDemande(idD: string, token : string): Observable<any> {
    const url = `${this.url}/delete/${idD}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(url,{headers});
  }

  demandeExtension(idD: string, extensionReq : any, token : string): Observable<any> {
    const url = `${this.url}/${idD}/extension`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(url, extensionReq,{headers});
  }

  getEmployee(token: string):Observable<any>{
    const url = `${this.url}/getEmployee`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

}
