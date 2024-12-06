import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChequeService {
  PATH = "http://localhost:8080"; 
  constructor(private httpClient:HttpClient) { }

  addCheque(Cheque:any , idoperation:number){
    const url = `${this.PATH}/addCheque?idoperation=${idoperation}`;
    return this.httpClient.post<any>(url, Cheque);
  }

  fetchCheque(){
    const url = `${this.PATH}/findCheques`;
    return this.httpClient.get<any>(url, {});
  }

}
