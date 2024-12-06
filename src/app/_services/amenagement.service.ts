import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AmenagementService {
  PATH = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  
  createArrangement(arrangement: any, numero: Number,username:string) {
    const url = `${this.PATH}/addArrangement?numero=${numero}&username=${username}`;
    return this.httpClient.post<any>(url, arrangement);
  }

  searchArrangementByDebiteur(id:number) {
    const url = `${this.PATH}/searchArrangementByDebiteur?id=${id}`;
    return this.httpClient.get<any>(url, {});
  }



}
