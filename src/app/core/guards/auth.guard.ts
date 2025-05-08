import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Corrected import
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken'); // Assuming the JWT is stored as 'token'
 
    if (token && this.isTokenValid(token)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
 
  private isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token); // Decode the token
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.exp > currentTime; // Check if the token is expired
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }
}