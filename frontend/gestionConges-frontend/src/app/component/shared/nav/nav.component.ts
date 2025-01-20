import { Component } from '@angular/core';
import {RouterModule } from '@angular/router';
import { ServiceService } from '../../auth/service.service';

@Component({
  selector: 'app-nav',
  imports: [RouterModule,],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  isAuthenticated:boolean = false;
  isAdmin:boolean = false;
  isAdminRH:boolean = false;
  isManager:boolean = false;
  isUser:boolean = false;
  constructor(private authService: ServiceService) {}

  ngOnInit(): void {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.isAdmin = this.authService.isAdmin();
      this.isAdminRH = this.authService.isAdminRH();
      this.isManager = this.authService.isManager();
      this.isUser = this.authService.isUser();
  }

  logout():void{
    this.authService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
    this.isAdminRH = false;
    this.isManager= false;
  }
}
