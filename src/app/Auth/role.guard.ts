import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();

    if (token) {
      const decodedToken: any = jwtDecode(token);
      const requiredRole = route.data['role'];
      
      
      // Retrieve the role claim from the token
      const userRole = decodedToken.userRole;

      // Check if the user role matches the required role
      if (userRole === requiredRole) {
        return true;
      } else {
        this.router.navigate(['/401']);
        return false;
      }
    } else {
      this.authService.Logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
