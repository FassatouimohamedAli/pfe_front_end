import { Component, OnInit } from '@angular/core';
import { AmenagementService } from '../_services/amenagement.service';
import { MessageService } from 'primeng/api';
import { EchancierService } from '../_services/echancier.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';
registerLocaleData(localeFr, 'fr-FR');

@Component({
  selector: 'app-echancier',
  templateUrl: './echancier.component.html',
  styleUrls: ['./echancier.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
})
export class EchancierComponent implements OnInit {
  searchId: number = 0;
  debiteur: any ;
  arrangement: any ;
  debiteurVisible: Boolean = false;
  debiteurTrouve: Boolean = false;
  montantPayer: number = 0;
  editing: boolean = false;
  editedRowIndex: number = -1;
  arrangements: any[] = [];
  echenciers: any = [] ;
  displayUpdateModal : boolean = false 

  constructor(private amenagementService: AmenagementService,
    private messageService: MessageService,
    private echancierService: EchancierService, 
    public userService :UserService
  ) { }





  ngOnInit(): void {

  }


  DetailModel(idarr:number){
this.displayUpdateModal = true ; 
this.fetchEchanicer(idarr);
  }


  searchDebiteur(): void {
    if (this.searchId) {
      this.amenagementService.searchArrangementByDebiteur(this.searchId)
        .subscribe(
          (data: any) => {
            if (data && data.id) { // Vérifier si un arrangement spécifique est retourné
              this.arrangement = data;
              this.debiteur = data.debiteur ; 
              this.debiteurVisible = true;
              this.debiteurTrouve = true; // Débiteur trouvé
              console.log(this.arrangement.id);
              //this.fetchEchanicer(this.arrangement.id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Arrangement trouvé avec succès' });
            } else {
              // Réinitialiser les données du débiteur et du risque
              this.debiteur = [];
              this.debiteurVisible = false;
              this.debiteurTrouve = false; // Débiteur non trouvé
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Aucun arrangement trouvé' });
            }
          },
          (error) => {
            this.debiteur = [];
            console.error('Error fetching arrangement:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de récupération des données de l\'arrangement' });
            this.debiteurVisible = false;
            this.debiteurTrouve = false;
          }
        );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Veuillez entrer un identifiant de débiteur' });
      this.debiteurVisible = false;
      this.debiteurTrouve = false;
    }
  }
  
  fetchEchanicer(id: number) {
    this.echancierService.fetchCheque(id)
      .subscribe(
        (data: any) => {
          this.echenciers = data 
        },
        (error) => {
          console.error('Error fetching echancier:', error);
        }
      );
  }



  onMontantPayerChange(): void {
    // Vérifie si le montant entré est supérieur au solde de recouvrement
    if (this.montantPayer > this.debiteur.soldeRecouvrement) {
      // Affichez un message d'erreur ou désactivez le champ
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le montant dépasse le solde de recouvrement' });
      // Vous pouvez désactiver le champ en mettant montantPayer à zéro ou en le rendant invalide
      // this.montantPayer = 0; // ou
      // this.montantPayer = null;
    }
  }

}

