import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RiskService {

  PATH = "http://localhost:8080";
   
  constructor(private httpClient:HttpClient) { }

  FindRisk(id:number){
    const url = `${this.PATH}/findRisk?id=${id}`;
    return this.httpClient.get<any>(url, {});
  }

 payerRisk(idRisk :number, montant:number,username:string){
    const url = `${this.PATH}/PayerRisk?idRisk=${idRisk}&montant=${montant}&username=${username}`;
    return this.httpClient.post<any>(url, {idRisk,montant})
  }


}
