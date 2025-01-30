import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Import HttpClient
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private url="http://localhost:8080";

  constructor(private http: HttpClient,private router: Router) { }
  login(email: string, password: string): Observable<any> {
    const url = `${this.url}/auth/login`;
    const body = { email, pwd: password }; // Assurez-vous que les clés sont correctes
    return this.http.post(url, body);
  }

  register(userData: any): Observable<any> {
    const url = `${this.url}/auth/register`;
    return this.http.post<any>(url, userData); 
  }

  getProfile(token: string): Observable<any> {
    const url = `${this.url}/adminRhUserManagerAdmin/get-profile`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    //console.log("Token:", token);  // Log token to verify it's set correctly
  
    return this.http.get<any>(url, { headers });
  }
  logOut(): void {
    if (typeof localStorage !== 'undefined') {
      // Remove token and role from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

      sessionStorage.clear();

    // Redirect user to login page or any public page after logout
    this.router.navigate(['/login']); 
  }
  isAuthenticated(): boolean {
    if(typeof localStorage !== 'undefined'){
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
}
   // Check if the user is an Admin
isAdmin(): boolean {
  if (typeof localStorage !== 'undefined') {
    const role = localStorage.getItem('role');
    return role === 'Admin';
  }
  return false;
}

// Check if the user is a Manager
isManager(): boolean {
  if (typeof localStorage !== 'undefined') {
    const role = localStorage.getItem('role');
    return role === 'Manager';
  }
  return false;
}

// Check if the user is a User
isUser(): boolean {
  if (typeof localStorage !== 'undefined') {
    const role = localStorage.getItem('role');
    return role === 'User';
  }
  return false;
}

// Check if the user is an Admin RH
isAdminRH(): boolean {
  if (typeof localStorage !== 'undefined') {
    const role = localStorage.getItem('role');
    return role === 'AdminRH';
  }
  return false;
}
updateUser(userId: string, userData: any, token: string): Observable<any> {
  const url = `${this.url}/admin/update/${userId}`;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.put<any>(url, userData, { headers });
}
//departement service is here
getAllDepartements(): Observable<any[]> {
  return this.http.get<any[]>(`${this.url}/api/departements/get-all`);
}


}
