import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationRecouvrementService {
  PATH = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }
  createOperationRecouvrement(paymentId: number, username: string) {
    const url = `${this.PATH}/addoperationtcheque?paymentId=${paymentId}&username=${username}`;
    return this.httpClient.post<any>(url, { paymentId, username });
  }


  validerOperationRecouvrement(operationId: number, etat: string, username: string) {
    const url = `${this.PATH}/validerOperationRecouvrement?operationId=${operationId}&etat=${etat}&username=${username}`;
    return this.httpClient.post<any>(url, { operationId, etat });
  }

  fetchOperationsRecouv() {
    const url = `${this.PATH}/fetchAllOperationsR`;
    return this.httpClient.get<any>(url, {})
  }

  
  checkOperationRecouvrement(idPayment:number) {
    const url = `${this.PATH}/checkOperationRecouvrement?idPayment=${idPayment}`;
    return this.httpClient.get<boolean>(url, {})
  }
}
