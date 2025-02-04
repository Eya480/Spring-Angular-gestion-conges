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
      this.loadNotifications();
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
      this.unreadCount = this.notifications.filter(n => !n.read).length;
    });
  }
  }

  markAsRead(notification: any): void {
    notification.read = true;
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }
}
