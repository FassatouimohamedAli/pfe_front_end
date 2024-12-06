import { Component, OnInit } from '@angular/core';
import { OperationService } from '../_services/operation.service';
import { MessageService } from 'primeng/api';
import { RiskService } from '../_services/risk.service';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ChequeService } from '../_services/cheque.service';
import { VirementService } from '../_services/virement.service';

@Component({
  selector: 'app-add-cheque',
  templateUrl: './add-cheque.component.html',
  styleUrls: ['./add-cheque.component.css']
})
export class AddChequeComponent implements OnInit {
  idOperation : number = 0 ; 
  operations : any = [] ; 
  risk:any ; 
  nomPropritaire:String = "" ;
  msgs1:any =[]; 
  numero:number = 0 ; 
  displayUpdateModal: boolean = false;
  currentPage: number = 0;
  pageSize: number = 3;
  searchTypePaymentOperation = '' ; 
  searchFirstName = '';
  paginationTemplate = 'Showing {first} to {last} of {totalRecords} operation';
  selectedTypePayment = '';
  etatOptions = [
    { label: 'Tous', value: '' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'Virement', value: 'Virement' }
    
  ];
  submitted = false;
  cheques: any;
  dateVirement: any ; 
  nomPropritaireVirement:String = "" ; 
  virements:any  ; 
dateVirementCalendar: any;
  
  constructor(private virementService:VirementService,private chequeService :ChequeService,private operationService:OperationService,private riskService:RiskService,private messageService:MessageService) { }
  ngOnInit(): void {
    this.fetechOperations();
    this.fetchCheque();
    this.fetchVirement();
    
  }

  DetailModel(idoperation:number){
    this.displayUpdateModal = true;
    this.idOperation= idoperation;
    //alert(idoperation)
    
  }
  
  isChequeType(idOperation: number): boolean {
    // Recherche de l'opération correspondant à l'identifiant donné
    const operation = this.operations.find((operation: { id: number; }) => operation.id === idOperation);
    
    // Vérification si l'opération a été trouvée
    if (operation) {
      // Vérification si le type de paiement de l'opération est 'Cheque'
      if (operation.typePayment === 'Cheque') {
        return true; // Retourne true si le type de paiement est 'Cheque'
      } else {
        return false; // Retourne false si le type de paiement n'est pas 'Cheque'
      }
    } else {
      return false; // Retourne false si aucune opération n'a été trouvée pour l'identifiant donné
    }
  }
  
  closeModal() {
  this.displayUpdateModal = false;

  }

  fetechOperations(): void {
    this.operationService.fetchAll().subscribe(
      (data: any[]) => {
        
        const validerOperations :any = [];
        const ChequeOperations:any = [];
        const VirementOperations:any = [];
  
        data.forEach((operation) => {
       
          if (operation.etatOperation.toUpperCase() === 'VALIDER' && operation.typePayment === 'Cheque') {
            ChequeOperations.push(operation);

          } else if (operation.etatOperation.toUpperCase() === 'VALIDER' && operation.typePayment === 'Virement'){
            VirementOperations.push(operation);
          }
        });

        

        this.msgs1 = [];
       
       

      
        if (ChequeOperations.length > 0) {
          
          this.msgs1.push({
            severity: 'success',
            summary: 'Informations',
            detail: `Vous avez ${ChequeOperations.length} opérations Type Cheque et ${VirementOperations.length} opérations Type Virement  .`
          });
        }
        
  
       
  
        // Concaténez les tableaux triés dans l'ordre souhaité
        this.operations = [...VirementOperations,...ChequeOperations].sort((a:any, b:any) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime());
        
        
      },
      (error) => {
        console.error('Error fetching operations:', error);
      }
    );
  }

  
  createVirment(VirmentForm:NgForm){
    //alert(this.idOperation)
    this.submitted = true;
    if (VirmentForm.valid  && this.dateVirement) {
      this.virementService.addvirement(VirmentForm.value,this.idOperation).subscribe(
        (response) => {
          console.log('add Virment:', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Virement Ajouter ' });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          console.error('Error add Virment:', error);

        }
        
      );
    }else{
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez sélectionner une date de virement.' });
    }
  }

  fetchVirement() {
    this.virementService.fetchVirement().subscribe(
      (data) => {
        console.log('fetch Virement:');
        this.virements = data;
      },
      (error) => {
        console.error('Error fetch Virement:', error);
      }
    );
  }

createCheque(ChequeForm:NgForm){
  this.submitted = true;
//alert(this.idOperation)
if (ChequeForm.valid) {
  this.chequeService.addCheque(ChequeForm.value,this.idOperation).subscribe(
    (response) => {
      console.error('add cheque:', response);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cheque Ajouter ' });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
    (error) => {
      console.error('Error add cheque:', error);
    }
    
  );
}else{
  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez donner un numero de cheque .' });
}
  }

  //pour verifier id de op dans t.cheque == t.op

  fetchCheque() {
    this.chequeService.fetchCheque().subscribe(
      (data) => {
        console.log('fetch cheque:');
        this.cheques = data;
      },
      (error) => {
        console.error('Error fetch cheque:', error);
      }
    );
  }

  



      
  isChequeAvailable(operationId: number): boolean {
    if (this.cheques) {
        // Vérifiez si un chèque correspondant à l'opération existe dans la liste des chèques
        return this.cheques.some((cheque: any) => cheque.operation.id === operationId);
    }
    return false; // Par défaut, retourne false si les chèques ne sont pas disponibles ou si aucun chèque ne correspond à l'opération
}

isVirementAvailable(operationId:number): boolean{
  if (this.virements)  {
    // Vérifiez si un chèque correspondant à l'opération existe dans la liste des chèques
    return this.virements.some((virement: any) => virement.operation.id === operationId);
}
return false; // Par défaut, retourne false si les chèques ne sont pas disponibles ou si aucun chèque ne correspond à l'opération
}


  filteredOperations(): any[] {
    return this.operations.filter((operation: any) =>
      (!this.selectedTypePayment || operation.typePayment.toUpperCase() === this.selectedTypePayment.toUpperCase()) &&
      operation.typePayment.toLowerCase().includes(this.searchTypePaymentOperation.toLowerCase())
    );
  }
  
}
