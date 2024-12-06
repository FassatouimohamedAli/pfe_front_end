import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  PATH = "http://localhost:8080";

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });
  constructor(private httpClient: HttpClient, private userAuthService: UserAuthService) { }

  public login(loginData: any) {
    return this.httpClient.post(this.PATH + '/authenticate', loginData, {
      headers: this.requestHeader
    });
  }

  registerNewUser(user: any) {
    return this.httpClient.post<any>(this.PATH + '/registerNewUser', user, { headers: this.requestHeader });
  }

  getAllUsers() {
    return this.httpClient.get<any[]>(this.PATH + "/users");
  }

  UpdateRole(userName: string, oldRoleName: string, newRoleName: string) {
    const url = `${this.PATH}/updateUser?userName=${userName}&oldRoleName=${oldRoleName}&newRoleName=${newRoleName}`;
    return this.httpClient.put<any>(url, {});
  }
  
  AddRole(userName: string, RoleAdd: string) {
    const url = `${this.PATH}/AddUser?userName=${userName}&RoleAdd=${RoleAdd}`;
    return this.httpClient.post<any>(url, {});
  }

  deleteRole(userName: string, roleName: string) {
    const url = `${this.PATH}/removeUserRole?userName=${userName}&roleName=${roleName}`;
    return this.httpClient.delete<any>(url, {});
  }

  searchUsersByFirstName(firstName: string): any {
    const url = `${this.PATH}/recherche?firstName=${firstName}`;
    return this.httpClient.get<any>(url, {});
  }






  public forUser(){
    return this.httpClient.get(this.PATH +'/forUser' , {responseType:"text"});
  }
  //public forUserAdmin(){
  // return this.httpClient.get(this.PATH +'/forAdminandUser' , {responseType:"text"});
  // }
  //public forAdmin(){
  //return this.httpClient.get(this.PATH +'/forAdmin' , {responseType:"text"});
  // }





  public roleMatch(allowedRoles: any): boolean {
    const userRoles: any[] = this.userAuthService.getRoles();

    if (userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i].roleName === allowedRoles[j]) {
            return true; // Si une correspondance est trouvée, retourne true
          }
        }
      }
    }

    return false; // Si aucune correspondance n'est trouvée, retourne false
  }



}
