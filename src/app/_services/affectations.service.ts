import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AffectationsService {
  PATH = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }


  fetchCheque(){
    const url = `${this.PATH}/allAffectations`;
    return this.httpClient.get<any>(url, {});
  }

}
