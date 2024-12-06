import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DebiteurService } from '../_services/debiteur.service';
import { OperationService } from '../_services/operation.service';
import { UserAuthService } from '../_services/user-auth.service';
import { RibVerifService } from '../rib-verif.service';
import { RiskService } from '../_services/risk.service';

@Component({
  selector: 'app-payer',
  templateUrl: './payer.component.html',
  styleUrls: ['./payer.component.css']
})
export class PayerComponent implements OnInit {
  searchId: number = 0;
  debiteur: any = [];
  debiteurVisible: boolean = false;
  displayUpdateModal: boolean = false;

  Risk: any[] = [];
  debiteurTrouve: boolean = false;
   // Nouvelle variable pour stocker la valeur maximale du curseur
   maxSliderValue: number = 0;
   rangeValues: number[] = [0, 0]; // Initialiser le tableau avec des valeurs par défaut
   montantPayer: number = 0;
   riskNumero: number = 0;
  constructor( private messageService: MessageService, private debiteurService: DebiteurService, 
    private operationService: OperationService,
    private confirmationService:ConfirmationService,
  private riskService :RiskService,
private userAuthService :UserAuthService) {

  }


  ngOnInit(): void {
    
  }




  showDialog(risk: any) {

    this.displayUpdateModal = true;
    if (risk && risk.id) {
      this.riskNumero = risk.id;
      this.montantPayer=risk.debiteur.soldeRecouvrement ;
    }
    alert(this.riskNumero);
    }
    
    updateMaxSliderValue(montantRisk: number): void {
      // Mettre à jour la valeur maximale du curseur
      this.maxSliderValue = this.debiteur.soldeRecouvrement - montantRisk;
      // Mettre à jour les valeurs du curseur pour refléter la nouvelle valeur maximale
      this.rangeValues = [0, this.maxSliderValue];
    }

 
  closeModal() {
    this.displayUpdateModal = false;
  }
 


  
  searchDebiteur(): void {
    if (this.searchId) {
      this.debiteurService.searchDebiteur(this.searchId)
        .subscribe(
          (data: any[]) => {
            if (data && data.length > 0) {
              this.debiteur = data[0].debiteur;
              this.Risk = data;
              this.debiteurVisible = true;
              this.debiteurTrouve = true; // Débiteur trouvé

              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Débiteur trouvé avec succès' });
            } else {
              // Réinitialiser les données du débiteur et du risque
              this.debiteur = [];
              this.Risk = [];
              this.debiteurVisible = false;
              this.debiteurTrouve = false; // Débiteur non trouvé
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Aucun débiteur trouvé' });
            }
          },
          (error) => {
            this.debiteur = [];
            this.Risk = [];
            console.error('Error fetching debtor:', error);
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

  confirmer(montantPayer: number) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir payer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const username = this.userAuthService.getUsername() as string;
        this.riskService.payerRisk(this.riskNumero, this.montantPayer,username).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'affectation effectué avec succès' });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.error('Insertion failed:', error);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du affectation' });
          }
        );
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeté', detail: 'Vous avez rejeté' });
      }
    });
  }
}
  

