import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TiersService {
  PATH = "http://localhost:8080";
  constructor(private httpClient:HttpClient) { }
  getAllTiers() {
    return this.httpClient.get<any[]>(this.PATH + "/tiers");
  }

  getTiersType(Type:string) {
    const url = `${this.PATH}/findtypeTiers?Type=${Type}`;
    return this.httpClient.get<any[]>(url , {});
  }

}
