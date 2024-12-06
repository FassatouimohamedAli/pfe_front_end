import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  PATH = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  createOperation(operation: any, username: String, numero: Number, riskNumero: Number) {
    const url = `${this.PATH}/addOperation?username=${username}&numero=${numero}&riskNumero=${riskNumero}`;
    return this.httpClient.post<any>(url, operation);
  }
 
  findByIdDebeteurOperation(id :number){
    const url = `${this.PATH}/findByIdOperation?id=${id}`;
    return this.httpClient.get<any>(url , {})
  }

  validerOperation(operationId: number, etat: string,username:string) {
    const url = `${this.PATH}/validerOperation?operationId=${operationId}&etat=${etat}&username=${username}`;
    return this.httpClient.post<any>(url, { operationId, etat });
  }

  //operations Frais 
  fetchOperations(){
    const url = `${this.PATH}/AllOperations`;
    return this.httpClient.get<any>(url,{})
}

//all op 
fetchAll(){
  const url = `${this.PATH}/fetchAllOperations`;
  return this.httpClient.get<any>(url,{})
}

  
}
