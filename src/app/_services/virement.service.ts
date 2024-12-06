import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VirementService {
  PATH = "http://localhost:8080"; 
  constructor(private httpClient : HttpClient) { }


  addvirement(virement:any , idoperation:number){
    const url = `${this.PATH}/AddVirement?idoperation=${idoperation}`;
    return this.httpClient.post<any>(url, virement);
  }

  fetchVirement(){
    const url = `${this.PATH}/findVirements`;
    return this.httpClient.get<any>(url,{});
  }
}
