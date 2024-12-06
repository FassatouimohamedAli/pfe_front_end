import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { OperationService } from '../_services/operation.service';
import { RiskService } from '../_services/risk.service';
import { MessageService } from 'primeng/api';
import { UserAuthService } from '../_services/user-auth.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  operations: any = [];
  risk: any;
  enCoursOperations: any = [];
  msgs1: any = [];
  displayUpdateModal: boolean = false;
  currentPage: number = 0;
  pageSize: number = 3;
  searchDateOperation = '';
  searchFirstName = '';
  paginationTemplate = 'Showing {first} to {last} of {totalRecords} operation';
  locale: string = '';
  constructor(private userAuthService: UserAuthService, private operationService: OperationService, private riskService: RiskService, private messageService: MessageService, @Inject(LOCALE_ID) private localeId: string) { }

  ngOnInit(): void {
    this.fetechOperations();
    this.locale = this.localeId;

  }

  DetailModel(id: number) {
    this.displayUpdateModal = true;
    this.fetchRisk(id);
  }

  closeModal() {
    this.displayUpdateModal = false;

  }

  fetechOperations(): void {
    this.operationService.fetchOperations().subscribe(
      (data: any[]) => {
        const enCoursOperations: any = [];
        const validerOperations: any = [];
        const rejeterOperations: any = [];

        data.forEach((operation) => {
          if (operation.etatOperation.toUpperCase() === 'EN COURS') {
            enCoursOperations.push(operation);
          } else if (operation.etatOperation.toUpperCase() === 'VALIDER') {
            validerOperations.push(operation);
          } else if (operation.etatOperation.toUpperCase() === 'REJETER') {
            rejeterOperations.push(operation);
          }
        });

        if (enCoursOperations.length > 0) {
          this.msgs1 = [{
            severity: 'info',
            summary: 'Informations',
            detail: `Vous avez ${enCoursOperations.length} opérations en cours à valider.`
          }];
        } else {
          this.msgs1 = [{
            severity: 'warn',
            summary: 'Informations',
            detail: 'Il n\'y a aucune opération en cours à valider.'
          }];
        }

        // Concaténez les tableaux triés dans l'ordre souhaité
        this.operations = [...enCoursOperations].sort((a: any, b: any) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime());
      },
      (error) => {
        console.error('Error fetching operations:', error);
      }
    );
  }

  fetchRisk(id: number): void {
    this.riskService.FindRisk(id).subscribe(
      (data: any[]) => {
        this.risk = data

      },
      (error) => {
        console.error('Error fetching risk:', error);
      }
    );

  }


  validerOperation(operationId: number, etat: string): void {

    const username = this.userAuthService.getUsername() as string;
    this.operationService.validerOperation(operationId, etat, username).subscribe(
      (response) => {
        if (etat === 'valider') {
          this.messageService.add({ severity: 'success', summary: 'Informations', detail: 'Opération validée' });
        } else if (etat === 'rejeter') {
          this.messageService.add({ severity: 'error', summary: 'Informations', detail: 'Opération rejetée' });
        }
        console.log('Operation validated successfully');
        // Optionnellement, vous pouvez actualiser la liste après que l'opération a été validée
        this.fetechOperations();
      },
      (error) => {
        console.error('Error validating operation:', error);
      }
    );
  }

}
