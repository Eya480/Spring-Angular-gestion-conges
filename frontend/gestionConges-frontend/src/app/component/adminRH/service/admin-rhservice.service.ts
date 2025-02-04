import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Import HttpClient
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminRHServiceService {
  private basic_url="http://localhost:8080/api";

  constructor(private http: HttpClient, private router: Router) { }

  register(userData: any, token: string): Observable<any> {
    const url = `${this.basic_url}/employees/create-employee`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(url, userData, {headers}); 
  }

  getAllEmp(token : string): Observable<any>{
    const url = `${this.basic_url}/employees`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  getEmployeeById(id : string , token: string): Observable<any>{
    const url = `${this.basic_url}/employees/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }
  
  getManagerByDepId(id : string , token: string): Observable<any>{
    const url = `${this.basic_url}/adminAdminRH/Manager/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  getAllDemandeByManagerId(id : string , token: string): Observable<any>{
    const url = `${this.basic_url}/employees/demandeByManagerId/${id}`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }

  updateEmployee(id: string, employee: any, token : string): Observable<any> {
    const url = `${this.basic_url}/employees/update-employee/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(url, employee,{headers});
  }

  deleteEmployee(id: string, token : string): Observable<any> {
    const url = `${this.basic_url}/employees/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(url,{headers});
  }
  //type conges
  createTypeConges(typeCData: any, token: string): Observable<any> {
    const url = `${this.basic_url}/typeConges/create-TypeConges`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(url, typeCData, {headers}); 
  }

  getAllTypeC(token : string): Observable<any>{
    const url = `${this.basic_url}/typeConges/get-all`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url,{headers});
  }
  deleteTypeC(id: string, token : string): Observable<any> {
    const url = `${this.basic_url}/typeConges/delete-typeC/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(url,{headers});
  }
}
