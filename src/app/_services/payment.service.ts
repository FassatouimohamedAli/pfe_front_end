import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

 
  PATH = "http://localhost:8080"; 

  constructor(private httpClient:HttpClient) { }

  searchpaymentDebiteur(id:number){
    const url = `${this.PATH}/searchPaymentDebiteur?id=${id}`;
    return this.httpClient.get<any>(url, {});
  }

  findAllPyament(){
    const url = `${this.PATH}/findAllpayment`;
    return this.httpClient.get<any>(url, {});
  }

}
