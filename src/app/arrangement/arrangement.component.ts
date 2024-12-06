import { Component, OnInit } from '@angular/core';
import { DebiteurService } from '../_services/debiteur.service';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { AmenagementService } from '../_services/amenagement.service';
import { UserAuthService } from '../_services/user-auth.service';
@Component({
  selector: 'app-amenagement',
  templateUrl: './arrangement.component.html',
  styleUrls: ['./arrangement.component.css']
})
export class AmenagementComponent implements OnInit {
  searchId: number = 0;
  TotalSoldesVisibe: Boolean = false

  montant: number = 0;
  datedebut: any;
  nbrEchancierParMois: number = 0;
  echancier = '';
  errorMessage: string = '';
  etatOptions: SelectItem[] = [
    { label: 'Selectionnez', value: '' },
    { label: 'Mensuel ', value: 'mensuel' },
    { label: 'Annuel ', value: 'annuel' },
    { label: 'Trimestriel ', value: 'trimestriel' },
    { label: 'Semestriel ', value: 'semestriel' }
  ];

  valid: Boolean = false;
arrangconfirmed : boolean= false   
echeancier : any[] = [];
confirmed: boolean= false  
  constructor(private debiteurService: DebiteurService,
    private messageService: MessageService,
    private amenagementService: AmenagementService,
    private userAuthService: UserAuthService
  ) { }

  ngOnInit(): void {

  }

  verifNbrEchancierMoisEchancierChange(event: any): void {
    this.echancier = event.value;
    this.validateNbrEchancierParMois();
  }

  validateNbrEchancierParMois(): void {
    this.errorMessage = '';

    if (this.nbrEchancierParMois) {
      switch (this.echancier) {
        case 'mensuel':
          if (this.nbrEchancierParMois <= 0) {
            this.errorMessage = 'Pour un échéancier mensuel, la période de paiement doit être entre superieur a zero .';
          }
          break;
        case 'annuel':
          if (this.nbrEchancierParMois != 12 || this.nbrEchancierParMois % 12 != 0) {
            this.errorMessage = 'Pour un échéancier annuel, la période de paiement doit être un multiple de 12.';

          }
          break;
        case 'trimestriel':
          if (this.nbrEchancierParMois % 3 !== 0 || this.nbrEchancierParMois <= 0) {
            this.errorMessage = 'Pour un échéancier trimestriel, la période de paiement doit être un multiple de 3 .';
          }
          break;
        case 'semestriel':
          if (this.nbrEchancierParMois % 6 !== 0 || this.nbrEchancierParMois <= 0) {
            this.errorMessage = 'Pour un échéancier semestriel, la période de paiement doit être un multiple de 6 ';
          }
          break;
        default:
          this.errorMessage = 'Veuillez sélectionner un type d’échéancier valide.';
      }
    } else {
      this.errorMessage = 'Veuillez entrer une période de paiement.';
    }
  }


  searchDebiteur(): void {
    if (this.searchId) {
      this.debiteurService.CalculeTotalSoldes(this.searchId)
        .subscribe(
          (data: number) => {
            this.montant = data;
            if (this.montant != 0) {

              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tu peux faire un aménagement.' });
              this.TotalSoldesVisibe = true;

            } else {
              this.TotalSoldesVisibe = false;
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Aucun débiteur pour faire un aménagement.' });
            }
          },
          (error) => {
            console.error('Error fetching debtor:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de récupération des données du débiteur.' });
            this.TotalSoldesVisibe = false;
          }
        );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Veuillez entrer un identifiant de débiteur.' });
      this.TotalSoldesVisibe = false;
    }
  }



  createAmenagement(createAmenagementForm: NgForm) {
    let formData = {
      montant: this.montant,
      datedebut: this.datedebut,
      nbrEchancierParMois: this.nbrEchancierParMois,
      echancier: this.echancier

    };

    const username = this.userAuthService.getUsername() as string;
    //console.log(formData.montant, formData.datedebut, formData.nbrEchancier, formData.echancier)

    console.log(formData, createAmenagementForm.value);
   
      this.amenagementService.createArrangement(formData, this.searchId, username).subscribe(
        (data : any[] ) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Aménagement confirmé' });
 
          this.arrangconfirmed = true  
          this.echeancier = data ; 
          this.confirmed = true ; 
        },
        (error) => {
          console.error("Erreur ", error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de confirmation de l\'aménagement' });
        }
      );
    }
  

}

