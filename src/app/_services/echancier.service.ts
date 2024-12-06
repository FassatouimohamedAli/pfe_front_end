import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EchancierService {
  PATH = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  fetchCheque(arrangementId:number){
    const url = `${this.PATH}/getEchanciersByArrangement?arrangementId=${arrangementId}`;
    return this.httpClient.get<any>(url, {});
  }
}


