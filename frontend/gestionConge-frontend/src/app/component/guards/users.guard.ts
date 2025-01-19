import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../auth/service/authentication.service';

// Users Guard - Protects routes for users
export const usersGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Check if the user is authenticated and if the role is "User"
  if (authService.isAuthenticated() && authService.isUser()) {
    return true;  // Allow access
  } else {
    router.navigate(['/login']);  // Redirect to login page
    return false;  // Deny access
  }
};

// Admin Guard - Protects routes for admins
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Check if the user is authenticated and if the role is "Admin"
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;  // Allow access
  } else {
    router.navigate(['/login']);  // Redirect to login page
    return false;  // Deny access
  }
};

// Manager Guard - Protects routes for managers
export const managerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Check if the user is authenticated and if the role is "Manager"
  if (authService.isAuthenticated() && authService.isManager()) {
    return true;  // Allow access
  } else {
    router.navigate(['/login']);  // Redirect to login page
    return false;  // Deny access
  }
};

// AdminRH Guard - Protects routes for admin RH users
export const adminRHGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Check if the user is authenticated and if the role is "AdminRH"
  if (authService.isAuthenticated() && authService.isAdminRH()) {
    return true;  // Allow access
  } else {
    router.navigate(['/login']);  // Redirect to login page
    return false;  // Deny access
  }
};
