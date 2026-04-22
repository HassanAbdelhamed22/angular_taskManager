import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, User } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  register(userData: User) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  login(loginData: User) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData);
  }

  saveAuthData(authResponse: AuthResponse) {
    localStorage.setItem(this.tokenKey, authResponse.accessToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getUser() {
    return localStorage.getItem('user');
  }

  getUserName() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).username : null;
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.tokenKey);
  }
}
