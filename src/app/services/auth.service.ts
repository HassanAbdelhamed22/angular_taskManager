import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, User } from '../models/user.model';
import { Observable, tap } from 'rxjs';
import { signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  private tokenKey = 'token';

  currentUser = signal<User | null>(this.getStoredUser());
  isLoggedIn = computed(() => !!this.currentUser());

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  register(userData: User) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  login(loginData: User) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData);
  }

  saveAuthData(authResponse: AuthResponse) {
    localStorage.setItem(this.tokenKey, authResponse.accessToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    this.currentUser.set(authResponse.user);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getUser() {
    return this.currentUser();
  }

  getUserName() {
    return this.currentUser()?.username || null;
  }

  getCurrentUserId(): string | number | null {
    return this.currentUser()?.id || null;
  }

  isLoggedInCheck() {
    return this.isLoggedIn();
  }
}
