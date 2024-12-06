import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  PATH = "http://localhost:8080"; 

  constructor(private httpClient:HttpClient) { }


  getAllRoles(){
    return this.httpClient.get<any[]>(this.PATH +"/getAllRoles");
  }

  createNewRole(role:any) {
    return this.httpClient.post<any>(this.PATH+'/createNewRole', role);
  }

  RolePrev(RolePrev :any ){
    return this.httpClient.post<any>(this.PATH+'/roleprev', RolePrev);

  }

}
