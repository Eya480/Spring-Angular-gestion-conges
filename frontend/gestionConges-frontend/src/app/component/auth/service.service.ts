import { Injectable } from '@angular/core';
import { HttpClient,HttpHandler, HttpHeaders } from '@angular/common/http'; // <-- Import HttpClient
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private url="http://localhost:8080";
  constructor(private http: HttpClient,private router: Router) { }
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/auth/login`, { email, password });
  }

  register(userData: any, token: string): Observable<any> {
    const url = `${this.url}/auth/register`;

    // Create the headers with the Authorization Bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Send the POST request with userData as the body and headers
    return this.http.post<any>(url, userData, { headers });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.url}/adminRhUserManager/get-profile`);
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
    return role === 'ADMIN';
  }
  return false;
}

// Check if the user is a Manager
isManager(): boolean {
  if (typeof localStorage !== 'undefined') {
    const role = localStorage.getItem('role');
    return role === 'MANAGER';
  }
  return false;
}

// Check if the user is a User
isUser(): boolean {
  if (typeof localStorage !== 'undefined') {
    const role = localStorage.getItem('role');
    return role === 'USER';
  }
  return false;
}

// Check if the user is an Admin RH
isAdminRH(): boolean {
  if (typeof localStorage !== 'undefined') {
    const role = localStorage.getItem('role');
    return role === 'ADMINRH';
  }
  return false;
}


}
