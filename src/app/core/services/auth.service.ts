import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { response } from 'express';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public loggedInUser: any = null;
  private apiUrl = 'http://localhost:5154/api/Auth';

  constructor(private http: HttpClient) {
    // Initialize loggedInUser from localStorage
    
  }

  login(credentials: any) {
    console.log('Login credentials:', credentials); // Debugging log
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.Token) {
          localStorage.setItem('token', response.Token);
        }
      })
    );
  }

  getUserId(): number {
    return this.loggedInUser?.id; // Return the user ID from the loggedInUser object
  }

  setUser(user: any): void {
    this.loggedInUser = user;
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    
  }

  clearUser(): void {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser'); // Remove loggedInUser from localStorage
    localStorage.removeItem('userId'); // Remove userId
    localStorage.removeItem('authToken'); // Remove authToken
    localStorage.removeItem('isLoggedIn'); // Remove isLoggedIn flag
    localStorage.removeItem('userEmail'); // Remove userEmail
  }

  logout(): void {
    this.clearUser(); // Clear user data
    console.log('User logged out successfully');
  }
}
