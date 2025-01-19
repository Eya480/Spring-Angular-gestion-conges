import { Component } from '@angular/core';
import {RouterOutlet } from '@angular/router';
import { FooterComponent } from './component/shared/footer/footer.component';
import { NavAuComponent } from './component/shared/nav-au/nav-au.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FooterComponent,NavAuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestionConge-frontend';
  showPublicNavbar = 'admin';  // Default to admin navbar

  constructor() {
  }
  }
