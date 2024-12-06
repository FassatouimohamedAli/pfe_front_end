import { Component, OnInit } from '@angular/core';

import { ConfirmEventType, MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { OperationRecouvrementService } from '../_services/operation-recouvrement.service';
import { UserAuthService } from '../_services/user-auth.service';
import { PaymentService } from '../_services/payment.service';
import { RibVerifService } from '../rib-verif.service';

@Component({
  selector: 'app-recouvrement',
  templateUrl: './recouvrement.component.html',
  styleUrls: ['./recouvrement.component.css']
})
export class RecouvrementComponent implements OnInit {
  searchId: number = 0;
  username: string = "";
  debiteur: any = [];
  debiteurVisible: boolean = false;
  displayUpdateModal: boolean = false;
  typePayment: string = "";
  Payment: any = [];
  debiteurTrouve: boolean = false;
  PaymentvirementClient: any = [];
  PaymentchequeClient: any = [];
  operationRecouvremens: any[] = [];
  searchDate: string = "";
  currentPage: number = 0;
  pageSize: number = 2;
  searchFirstName = '';
  operationPayment: number = 0;
  paginationTemplate = 'Showing {first} to {last} of {totalRecords} PaymentvirementClient';
  paginationChequeTemplate = 'Showing {first} to {last} of {totalRecords} PaymentchequeClient';
 
  constructor(

    private userAuthService: UserAuthService,
    private operationRecouvrementService: OperationRecouvrementService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private paymentService: PaymentService,

  ) { }

  ngOnInit(): void {
    // this.checkOperationRecouvrement(this.paymentId);
    this.fetchopR();
    // Supprimer l'élément du tableau lorsque la page est actualisée
this. searchDebiteur();
  }




 

  searchDebiteur() {
    if (this.searchId) {
      this.paymentService.searchpaymentDebiteur(this.searchId).subscribe(
        (data: any) => {
          if (data && data.length > 0) {
            this.debiteur = data[0].debiteur;
            this.Payment = data;

            // Vérifiez d'abord le type de paiement et assignez les données appropriées
            this.PaymentchequeClient = data.filter((payment: any) => payment.typePayment === 'Cheque');
            this.PaymentvirementClient = data.filter((payment: any) => payment.typePayment === 'Virement');



            this.debiteurVisible = true;
            this.debiteurTrouve = true;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Débiteur trouvé avec succès' });
          } else {
            this.debiteurVisible = false;
            this.debiteurTrouve = false;
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Aucun débiteur trouvé' });
          }
        },
        (error) => {
          console.error(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de récupération des données du débiteur' });
          this.debiteurVisible = false;
          this.debiteurTrouve = false;
        }
      );
    } else
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Veuillez entrer un identifiant de débiteur' });
    this.debiteurVisible = false;
    this.debiteurTrouve = false;
  }


  confirm(idpayment: number) {


    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir confirmer cette opération ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const username = this.userAuthService.getUsername() as string;
        this.operationRecouvrementService.createOperationRecouvrement(idpayment, username).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Traitement de recouvrement insérée avec succès' });
            setTimeout(() => {
              window.location.reload();
            }, 1000);


          },

          (error) => {
            console.error('Insertion failed:', error);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'insertion de l\'opération de recouvrement' });
          }
        );
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejeté', detail: 'Vous avez rejeté' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Annulé', detail: 'Vous avez annulé' });
            break;
        }
      }
    });


  }



  fetchopR() {
    this.operationRecouvrementService.fetchOperationsRecouv().subscribe(
      (data) => {
        console.log('fetch Virement:');
        this.operationRecouvremens = data;
      },
      (error) => {
        console.error('Error fetch Virement:', error);
      }
    );
  }

  

  isOperationConfirmed(Payment: number): boolean {
    if (this.operationRecouvremens) {
      // Vérifiez si un operationRecouvremens correspondant à le payment existe dans la liste des payments pour chequesC: VirmentC
      return this.operationRecouvremens.some((opR: any) => opR.payment.id === Payment);
    }
    return false; 
  }

}





