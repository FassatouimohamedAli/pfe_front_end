import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DebiteurService {

  PATH = "http://localhost:8080"; 

  constructor(private httpClient:HttpClient) { }

//search risk par id  deb 
  searchDebiteur(id:number): Observable<any> {
    const url = `${this.PATH}/searchDebiteur?id=${id}`;
    return this.httpClient.get<any>(url, {});
  }

  FetchDebiteur():any{
    const url = `${this.PATH}/AllDebiteur`;
    return this.httpClient.get<any>(url, {});
  }

//calcule risks  of debiteur 

CalculeTotalSoldes(id:number): Observable<any> {
  const url = `${this.PATH}/calculateTotalMontant?id=${id}`;
  return this.httpClient.get<any>(url, {});
}

}
