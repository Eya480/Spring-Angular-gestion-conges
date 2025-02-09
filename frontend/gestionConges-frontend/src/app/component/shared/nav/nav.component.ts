import { Component } from '@angular/core';
import {RouterModule } from '@angular/router';
import { ServiceService } from '../service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterModule,CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  isAuthenticated:boolean = false;
  profileInfo: any;
  isAdmin:boolean = false;
  isAdminRH:boolean = false;
  isManager:boolean = false;
  notifications: any[] = [];
  unreadCount: number = 0;
  isUser:boolean = false;
  token = localStorage.getItem("token");
  constructor(private authService: ServiceService) {}

  ngOnInit(): void {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.isAdmin = this.authService.isAdmin();
      this.isAdminRH = this.authService.isAdminRH();
      this.isManager = this.authService.isManager();
      this.isUser = this.authService.isUser();
      console.log(this.authService.isAdminRH());

      if(this.isUser || this.isManager){
      this.loadNotifications();
      }

      if(this.token){
      this.authService.getProfile(this.token).subscribe({
        next: (response) => {
          this.profileInfo = response.personnel; 
        },
        error: () => {          
        },
      });
    }
  }

  logout():void{
    this.authService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
    this.isAdminRH = false;
    this.isManager= false;
  }

  loadNotifications(): void {
    if(this.token){
    this.authService.getAllNotif(this.token).subscribe(data => {
      this.notifications = data;
      this.notifications.sort((a,b)=>(a.is_read?1:-1) - (b.is_read?1:-1) );
      this.unreadCount = this.notifications.filter(n => !n.is_read).length;
    });
  }
  }

  markAsRead(notification: any,id : any): void {
    notification.is_read = true;
    if(this.token){
      this.authService.updateEtatIsRead(id,this.token).subscribe();
      
    }
    this.unreadCount = this.notifications.filter(n => !n.is_read).length;
  }
}
