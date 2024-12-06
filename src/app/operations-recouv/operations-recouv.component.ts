import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OperationService } from '../_services/operation.service';
import { UserAuthService } from '../_services/user-auth.service';
import { OperationRecouvrementService } from '../_services/operation-recouvrement.service';
import { RiskService } from '../_services/risk.service';
import { DebiteurService } from '../_services/debiteur.service';
import * as FileSaver from 'file-saver';
import jsPDF  from 'jspdf';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-operations-recouv',
  templateUrl: './operations-recouv.component.html',
  styleUrls: ['./operations-recouv.component.css']
})
export class OperationsRecouvComponent implements OnInit {
  operationsRecouv: any = [];
  Risk: any;
  enCoursOperations: any = [];
  msgs1: any = [];
  displayUpdateModal: boolean = false;
  currentPage: number = 0;
  pageSize: number = 3;
  searchDateOperation = '';
  searchFirstName = '';
  paginationTemplate = 'Showing {first} to {last} of {totalRecords} operation';
  locale: string = '';

  debiteur:any ; 
  exportColumns: any;
  cols: any;
  selectedEtat = '';
  etatOptions = [
    { label: 'Tous', value: '' },
    { label: 'En cours', value: 'EN COURS' },
    { label: 'Validé', value: 'VALIDER' },
    { label: 'Annuller', value: 'ANNULLER' }

  ];

  isAnnullerExpire: boolean= false;
  constructor(private userAuthService: UserAuthService, 
    private operationRecouvrementService:OperationRecouvrementService,
    private debiteurService:DebiteurService, 
     private messageService: MessageService) { }

  ngOnInit(): void {
    this.startTime();
    this.fetechOperationsRecouvrment();

    this.cols = [
      { field: 'Date Operation', header: 'Date Operation' },
      { field: 'Type Operation', header: 'Type Operation' },
      { field: 'Etat Operation', header: 'Etat Operation' },
 
      { field: 'Type Payment', header: 'Type Payment' },
      { field: 'Montant', header: 'Montant' }
    ];

    this.exportColumns = this.cols.map((col: { header: any; field: any; }) => ({ title: col.header, dataKey: col.field }));
  }

  startTime(){
    this.userAuthService.getTimeAnnuller();
    this.isAnnullerExpire =true ;// 5 minites bl milisecondz  ( 24h bl milisecondes = 24*60*60*1000)
  }

  DetailModel(id: number) {
    this.displayUpdateModal = true;
    console.log(id);
    this.searchdebiteur(id);
  }

  closeModal() {
    this.displayUpdateModal = false;

  }

  searchdebiteur(id:number){
        this.debiteurService.searchDebiteur(id)
          .subscribe(
            (data: any[]) => {
                this.debiteur = data[0].debiteur;
                this.Risk = data;
           
  
            },
            (error) => {
              this.debiteur = [];
              this.Risk = [];
              console.error('Error fetching debtor:', error);
         
            }
          );
      
  }
  fetechOperationsRecouvrment(): void {
    this.operationRecouvrementService.fetchOperationsRecouv().subscribe(
      (data: any[]) => {
        const enCoursOperationsRecouv: any = [];
        const validerOperationsRecouv: any = [];
        const rejeterOperationsRecouv: any = [];
        const annullerOperationsRecouv: any = [];

        data.forEach((operation) => {
          if (operation.etatOperation.toUpperCase() === 'EN COURS') {
            enCoursOperationsRecouv.push(operation);
          } else if (operation.etatOperation.toUpperCase() === 'VALIDER') {
            validerOperationsRecouv.push(operation);
          } else if (operation.etatOperation.toUpperCase() === 'REJETER') {
            rejeterOperationsRecouv.push(operation);
          }else if (operation.etatOperation.toUpperCase() === 'ANNULLER') {
            annullerOperationsRecouv.push(operation);
          }
        });

        if (enCoursOperationsRecouv.length > 0) {
          this.msgs1 = [{
            severity: 'info',
            summary: 'Informations',
            detail: `Vous avez ${enCoursOperationsRecouv.length} opérations en cours à valider.`
          }];
        } else {
          this.msgs1 = [{
            severity: 'warn',
            summary: 'Informations',
            detail: 'Il n\'y a aucune opération en cours à valider.'
          }];
        }

        if (validerOperationsRecouv.length > 0) {
          this.msgs1 = [{
            severity: 'success',
            summary: 'Informations',
            detail: `Vous avez ${validerOperationsRecouv.length} opérations valider.`
          }];
        } else {
          this.msgs1 = [{
            severity: 'warn',
            summary: 'Informations',
            detail: 'Il n\'y a aucune opération en cours à valider.'
          }];
        }

        if (annullerOperationsRecouv.length > 0) {
          this.msgs1 = [{
            severity: 'info',
            summary: 'Informations',
            detail: `Vous avez ${annullerOperationsRecouv.length} opérations Annuller.`
          }];
        } 

        // Concaténez les tableaux triés dans l'ordre souhaité
        this.operationsRecouv = [...enCoursOperationsRecouv,...validerOperationsRecouv,...annullerOperationsRecouv].sort((a: any, b: any) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime());
      },
      (error) => {
        console.error('Error fetching operations:', error);
      }
    );
  }

  validerOperation(idoperation:number,etat :string){
//console.log(idoperation , etat) ;
const username = this.userAuthService.getUsername() as string;
    this.operationRecouvrementService.validerOperationRecouvrement(idoperation, etat, username).subscribe(
      (response) => {
        if (etat === 'valider') {
          this.messageService.add({ severity: 'success', summary: 'Informations', detail: 'Opération validée' });
        } else if (etat === 'rejeter') {
          this.messageService.add({ severity: 'error', summary: 'Informations', detail: 'Opération rejetée' });
        } else if (etat === 'annuller') {
          this.messageService.add({ severity: 'warn', summary: 'Informations', detail: 'Opération annulée' });
        }
        console.log('Operation validated successfully');
        // Optionnellement, vous pouvez actualiser la liste après que l'opération a été validée
        this.fetechOperationsRecouvrment();
      },
      (error) => {
        console.error('Error validating operation:', error);
      }
    );
  }

  filteredOperations(): any[] {
    return this.operationsRecouv
      .filter((operation: any) =>
        (!this.selectedEtat || operation.etatOperation.toUpperCase() === this.selectedEtat.toUpperCase()) &&
        operation.typeOperation.toLowerCase().includes(this.searchDateOperation.toLowerCase())
      );
  }

  getFilename(): string {
    let filename = 'Tous';
    if (this.selectedEtat) {
      filename = `${this.selectedEtat.toLowerCase()}`;
    }
    return filename;
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('p', 'pt', 'letter');
        const data = this.filteredOperations().map((operation: any) => ({
          'Date Operation': operation.dateOperation ? new DatePipe('fr-FR').transform(operation.dateOperation, 'dd MMM yyyy') : '',
          'Type Operation': operation.typeOperation,
          'Etat Operation': operation.etatOperation,
          'Type Payment': operation.payment.typePayment,
          'Montant': operation.payment.montant  ,
        }));
  
        //console.log(data);
        const filename = this.getFilename(); // nom de filtrage ( le choix )
  
        (doc as any).autoTable(this.exportColumns, data, {
          margin: { top: 60 },
          headerStyles: {
            halign: 'center',
            valign: 'middle',
            fontSize: 10
          },
          bodyStyles: {
            valign: 'middle'
          }
        });
  
        doc.save(`${filename}_operations.pdf`);
      })
    })
  }

 /*
  
  exportExcel() {
    import("xlsx").then(xlsx => {
      const filteredData = this.filteredOperations().map(operation => ({
        'Date Operation': operation.dateOperation ? new DatePipe('fr-FR').transform(operation.dateOperation, 'dd MMM yyyy') : '',
        'Type Operation': operation.typeOperation,
        'Etat Operation': operation.etatOperation,
       
        'Type Payment': operation.typePayment,
        'Montant': operation.montant,
      }));
      const filename = this.getFilename();
  
      const worksheet = xlsx.utils.json_to_sheet(filteredData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      this.saveAsExcelFile(excelBuffer, `${filename}_operations`);
    });
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + currentDate + EXCEL_EXTENSION);
  }

  */
  }


