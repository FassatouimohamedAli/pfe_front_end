import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor() { }

  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): any[] {
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      return JSON.parse(rolesString);
    } else {
      return [];
    }
  }

  public setUsername(username: string) {
    localStorage.setItem('username', username);
  }

  public getUsername(): string | null {
    return localStorage.getItem('username');
  }

  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }


  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken() && this.getUsername();
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true; // If no token is found, consider it expired
    const tokenData = JSON.parse(atob(token.split('.')[1])); // Extract token data
    return tokenData.exp * 1000 < Date.now(); // Check if token expiration time is in the past
  }

  public getTimeAnnuller(){
    setTimeout(() => {
    }, 5 * 60 * 1000); 
  }
  
  
}
