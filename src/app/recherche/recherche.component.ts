import { Component, OnInit } from '@angular/core';
import { DebiteurService } from '../_services/debiteur.service';
import { NgForm } from '@angular/forms';
import { OperationService } from '../_services/operation.service';
import { UserAuthService } from '../_services/user-auth.service';
import { MessageService } from 'primeng/api';
import { RibVerifService } from '../rib-verif.service';
import { TiersService } from '../_services/tiers.service';


@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.css']
})
export class RechercheComponent implements OnInit {
  searchId: number = 0;
  username: String = "";
  debiteur: any = [];
  debiteurVisible: boolean = false;
  displayUpdateModal: boolean = false;
  montant: string = "";
  nomBeneficier: string = "";
  typePayment: string = "";
  detailOperation: string = "";
  objectOperation: string = "";
  objectOptions: string[] = [];
  rib: String = "";
  riskNumero: Number = 0;
  submitted = false;
  Risk: any[] = [];
  debiteurTrouve: boolean = false;
  isValidRib: boolean = false;
  bankName: string = '';
  isRibValidating: boolean = false;
  tiers: any = [];
  avocats: any = []; // Tableau pour stocker les avocats
  experts: any = []; // Tableau pour stocker les experts
  huissiers: any = [];
  selectedTierId: any;

  constructor(private tiersService: TiersService, private messageService: MessageService, private debiteurService: DebiteurService, private operationService: OperationService, private userAuthService: UserAuthService, private ribVerifService: RibVerifService) {

  }

  ngOnInit(): void {
  }

  startRibValidation() {
    // Mettre à jour l'indicateur de chargement lors de la saisie du RIB
    this.isRibValidating = true;
    // Lancer la validation après un délai (par exemple 500 ms) pour éviter une validation trop fréquente pendant la saisie
    setTimeout(() => {
      this.checkRibValidity();
    }, 500);
  }

  checkRibValidity() {
    if (this.rib && this.ribVerifService.isValid(this.rib as string)) {
      this.isValidRib = true;
      this.bankName = this.ribVerifService.getBankName(this.rib as string);
    } else {
      this.isValidRib = false;
      this.bankName = '';
    }
    // Mettre à jour l'indicateur de chargement après la validation
    this.isRibValidating = false;
  }
 
  resetForm() {

    this.detailOperation = ''; // Réinitialiser la valeur de la liste déroulante de détail d'opération
    this.objectOperation = ''; // Réinitialiser la valeur de la liste déroulante d'objet d'opération
    this.typePayment = '' ; // Réinitialiser la valeur de la liste déroulante de type de paiement
  }

  showDialog(risk: any) {

    this.displayUpdateModal = true;
    if (risk && risk.id) {
      this.riskNumero = risk.id;
    }
    alert(this.riskNumero);
    }
    

    onTypePaymentChange() {
      // Si le type de paiement actuel est "Virement" et le nouveau type de paiement est "Chèque"
      if (this.typePayment === 'Cheque' || this.typePayment === 'Espece' ) {
        // Réinitialiser la valeur du champ "Virement"
        this.rib = '';
      }
    }
  


  

 
  closeModal() {
    this.displayUpdateModal = false;
  }
  updateObjectOptions() {

    this.objectOperation = '';

    // Mettre à jour les options en fonction de la sélection de detailOperation
    switch (this.detailOperation) {
      case 'Enregistrement':
        this.objectOptions = ['Effet', 'Action du caution', 'Jugement'];
        break;
      case 'Timbrage':
        this.objectOptions = ['Effet', 'Jugement'];
        break;
      case 'Divers':
        this.objectOptions = ['Frais gardinage', 'Retrait de titre CPF', 'Autres'];
        break;
      case 'Tiers':
        this.objectOptions = ['Avocat', 'Huissier', 'Expert'];
       
        break;
      default:
        this.objectOptions = [];
        break;
    }

  }

  fetchTiersType(objectOptions:String ) {
    let type = ''; 
    if (objectOptions === 'Avocat') {
       type = 'Avocat' ;
    }else if (objectOptions === 'Huissier') {
       type = 'Huissier' ;
    }else if (objectOptions === 'Expert') {
    type = 'Expert' ;
    }
    //alert(type);
    if (type !== '') {
    this.tiersService.getTiersType(type).subscribe(
      (data: any[]) => {
        this.tiers = data;
      },
      (error) => {
        console.error('Error fetching tiers:', error);
      }
    );
  }
}



  createOperation(createOperationForm: NgForm) {
    this.submitted = true;
    if (createOperationForm.valid) {

      const username = this.userAuthService.getUsername() as string;
      //alert(this.riskNumero);
      if (createOperationForm.valid) {
        this.operationService.createOperation(createOperationForm.value, username, this.searchId, this.riskNumero).subscribe(
          (response) => {
            console.log('Operations registered successfully:', response);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Operation created successfully' });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.error('Error registering Operation:', error);

          }
        );
      } else {
        console.error('Form is invalid.');
      }
    }
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
}
