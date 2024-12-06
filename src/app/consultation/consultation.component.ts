import { Component, OnInit } from '@angular/core';
import { OperationService } from '../_services/operation.service';
import { RiskService } from '../_services/risk.service';
import { MessageService } from 'primeng/api';

import { OperationRecouvrementService } from '../_services/operation-recouvrement.service';
import { DebiteurService } from '../_services/debiteur.service';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { AffectationsService } from '../_services/affectations.service';
import { HttpBackend } from '@angular/common/http';
interface OperationRecouvrement {
  id?: number;
  dateOperation?: Date;
  typeOperation?: string;
  objectOperation?: string;
  detailOperation?:string ;
  montant?: number;
  typePayment?: string;
  etatOperation?: string;
  deb?: number;
}

interface Affectation {
  id?: number;
  dateOperation?: Date;
  typeOperation?: string;
  etatOperation?: string;
  objectOperation?: string;
  detailOperation?:string ;
  risk?: number;
  montant?: number;
  typePayment?: string;
}

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit {


  operations: any = [];
  risk: any;
  msgs2: any[] = [];
  displayUpdateModal: boolean = false;
  currentPage: number = 0;
  pageSize: number = 3;
  searchTypeOperation = '';
  searchFirstName = '';
  paginationTemplate = 'Showing {first} to {last} of {totalRecords} operation';
  selectedEtat = '';
  etatOptions = [
    { label: 'Tous', value: '' },
    { label: 'En cours', value: 'EN COURS' },
    { label: 'Validé', value: 'VALIDER' },
    { label: 'Rejeté', value: 'REJETER' },
    { label: 'Annuller', value: 'ANNULLER' }

  ];

  displaydetailrecouvModal: boolean = false;
  Risk: any;
  operationRecouvrement: any = [];
  enCoursOperations: any = [];
  validerOperations: any = [];
  rejeterOperations: any = [];
  enCoursOperationsRecouvrement: any = [];
  validerOperationsRecouvrement: any = [];
  rejeterOperationsRecouvrement: any = [];
  AnnullerOperationsRecouvrement:any = [] ;
  debiteur: any; // Initialize as an array
  exportColumns: any;
  cols: any;
  affectationsRecouv: any = [];
  totalEnCours: any;
  totalValider: any;
  totalRejeter: any;

  constructor(private operationService: OperationService,
    private riskService: RiskService, private messageService: MessageService,
    private operationRecouvrementService: OperationRecouvrementService
    , private debiteurService: DebiteurService,
    private AffectationService: AffectationsService) { }

  ngOnInit(): void {

    this.fetchOperations();
    this.fetechAffectations();
    this.fetechOperationsRecouvrement();
    //this.updateMessages();

    this.cols = [
      { field: 'Date Operation', header: 'Date Operation' },
      { field: 'Type Operation', header: 'Type Operation' },
      { field: 'Etat Operation', header: 'Etat Operation' },
      { field: 'Detail Operation', header: 'Detail Operation' },
      { field: 'Object Operation', header: 'Object Operation' },
      { field: 'Type Payment', header: this.searchTypeOperation.toLowerCase() === 'affectation' ? 'Type Affectation' : 'Type Payment' },
      { field: 'Montant', header: 'Montant' }
    ];

    this.exportColumns = this.cols.map((col: { header: any; field: any; }) => ({ title: col.header, dataKey: col.field }));
  }

  DetailModel(id: number | undefined, iddeb: number | undefined) {
    if (id) {
      console.log("Risk ID:", id); // Ajouter un log
      this.fetchRisk(id); 
      this.displayUpdateModal = true; // Ensure that only risk details are displayed
    } else if (iddeb) {
      console.warn("Debtor ID:", iddeb); // Ajouter un log
      this.searchdebiteur(iddeb);
      this.displaydetailrecouvModal = true; // Ensure that debtor details are displayed
    } else {
      this.displayUpdateModal = false;
      this.displaydetailrecouvModal = false;
    }
  }
  

  searchdebiteur(id: number) {
    this.debiteurService.searchDebiteur(id)
      .subscribe(
        (data: any[]) => {
          this.debiteur = data[0].debiteur; // Wrap the object in an array
          this.Risk = data;
        },
        (error) => {
          console.error('Error fetching debtor:', error);
        }
      );
  }


  closeModal() {
    this.displayUpdateModal = false;
    this.displaydetailrecouvModal = false;
  }

  fetechOperationsRecouvrement(): void {
    this.operationRecouvrementService.fetchOperationsRecouv().subscribe(
      (data: any[]) => {
        const recouvrementOperations: OperationRecouvrement[] = data.map((item: any) => ({
          id: item.id,
          dateOperation: item.dateOperation,
          typeOperation: item.typeOperation,
          etatOperation: item.etatOperation,
          deb: item.payment.debiteur.numero,
          montant: item.payment.montant,
          objectOperation:'***',
          detailOperation:'***',
          typePayment: item.payment.typePayment,
        }));
        this.operationRecouvrement = recouvrementOperations;
        this.enCoursOperationsRecouvrement = this.operationRecouvrement.filter((operation: { etatOperation: string; }) => operation.etatOperation.toUpperCase() === 'EN COURS');
        this.validerOperationsRecouvrement = this.operationRecouvrement.filter((operation: { etatOperation: string; }) => operation.etatOperation.toUpperCase() === 'VALIDER');
        this.rejeterOperationsRecouvrement = this.operationRecouvrement.filter((operation: { etatOperation: string; }) => operation.etatOperation.toUpperCase() === 'REJETER');
        this.AnnullerOperationsRecouvrement = this.operationRecouvrement.filter((operation: { etatOperation: string; }) => operation.etatOperation.toUpperCase() === 'ANNULLER');
      },
      (error) => {
        console.error('Error fetching recouvrement operations:', error);
      }
    );
  }

  fetechAffectations(): void {
    this.AffectationService.fetchCheque().subscribe(
      (data: any[]) => {
        const Affectations: Affectation[] = data.map((item: any) => ({
          id: item.id,
          dateOperation: item.dateEffectation,
          typeOperation: 'Affectation',
          etatOperation: 'valider',
          risk: item.risk,
          montant: item.montant,
          objectOperation:'***',
          detailOperation:'***',
          typePayment: item.typEffectation,
        }));
        this.affectationsRecouv = Affectations;
        
      },
      (error) => {
        console.error('Error fetching recouvrement operations:', error);
      }
    );
  }


  fetchOperations(): void {
    this.operationService.fetchAll().subscribe(
      (data: any[]) => {
        this.operations = data;

        // Filtrer et répartir les opérations en cours, validées et rejetées
        this.enCoursOperations = this.operations.filter((operation: { etatOperation: string; }) => operation.etatOperation.toUpperCase() === 'EN COURS');
        this.enCoursOperations.sort((a: any, b: any) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime());
        this.validerOperations = this.operations.filter((operation: { etatOperation: string; }) => operation.etatOperation.toUpperCase() === 'VALIDER');
        this.validerOperations.sort((a: any, b: any) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime());
        this.rejeterOperations = this.operations.filter((operation: { etatOperation: string; }) => operation.etatOperation.toUpperCase() === 'REJETER');
        this.rejeterOperations.sort((a: any, b: any) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime());
       this.updateMessages();
       
      },
      (error) => {
        console.error('Error fetching operations:', error);
      }
    );
  }

  updateMessages(): void {
    
    this.msgs2 = [];
    let totalEnCours = this.enCoursOperations.length + this.enCoursOperationsRecouvrement.length;
    let totalValider = this.validerOperations.length + this.validerOperationsRecouvrement.length + this.affectationsRecouv.length;
    let totalRejeter = this.rejeterOperations.length + this.rejeterOperationsRecouvrement.length;
    let totalOperations = this.operations.length; // Nouvelle ligne pour calculer le total des opérations
    if (totalEnCours > 0) {
      this.msgs2.push({
        severity: 'info',
        summary: 'Informations',
        detail: `Vous avez ${totalEnCours} opérations en cours.`
      });
    }
    if (totalValider > 0) {
      this.msgs2.push({
        severity: 'success',
        summary: 'Informations',
        detail: `Vous avez ${totalValider} opérations validées.`
      });
    }
    if (totalRejeter > 0) {
      this.msgs2.push({
        severity: 'error',
        summary: 'Informations',
        detail: `Vous avez ${totalRejeter} opérations rejetées.`
      });
    }

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
  /*
    fetchallop(){
      this.fetchOperations() ; 
      this.fetechAffectations(); 
      this.fetechOperationsRecouvrement();
      this.updateMessages();
    }
    */


  filteredOperations(): any[] {
    
    return [...this.enCoursOperations, ...this.enCoursOperationsRecouvrement, ...this.validerOperations, ...this.validerOperationsRecouvrement, ...this.AnnullerOperationsRecouvrement, ...this.affectationsRecouv, ...this.rejeterOperations, ...this.rejeterOperationsRecouvrement]
      .filter((operation: any) =>
        (!this.selectedEtat || operation.etatOperation.toUpperCase() === this.selectedEtat.toUpperCase()) &&
        operation.typeOperation.toLowerCase().includes(this.searchTypeOperation.toLowerCase())
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
          'Detail Operation': operation.detailOperation ? operation.detailOperation : '***',
          'Object Operation': operation.objectOperation ? operation.objectOperation : '***',
          'Type Payment': operation.typePayment,
          'Montant': operation.montant,
        }));

        //console.log(data);
        const filename = this.getFilename(); // nom de filtrage ( le choix )

        const headerStyles = {
          fillColor: [0, 255, 0], // Vert
          textColor: [255, 255, 255], // Blanc
          fontSize: 10
        };

        (doc as any).autoTable(this.exportColumns, data, {
          margin: { top: 60 },
          headerStyles: {
            halign: 'center',
            valign: 'middle',
            fontSize: 10,
            fillColor: [6, 135, 122],
            textColor: [255, 255, 255],
          },
          bodyStyles: {
            valign: 'middle'
          }
        });

        doc.save(`${filename}_operations.pdf`);
      })
    })
  }



  exportExcel() {
    import("xlsx").then(xlsx => {
      const filteredData = this.filteredOperations().map(operation => ({
        'Date Operation': operation.dateOperation ? new DatePipe('fr-FR').transform(operation.dateOperation, 'dd MMM yyyy') : '',
        'Type Operation': operation.typeOperation,
        'Etat Operation': operation.etatOperation,
        'Detail Operation': operation.detailOperation ? operation.detailOperation : '***',
        'Object Operation': operation.objectOperation ? operation.objectOperation : '***',
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

}
