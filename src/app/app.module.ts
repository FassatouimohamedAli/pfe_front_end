import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './_auth/auth.guard';
import { AuthInterceptor } from './_auth/auth.interceptor';
import { UserService } from './_services/user.service';
import { RoleComponent } from './role/role.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RechercheComponent } from './recherche/recherche.component';
import { CardModule } from 'primeng/card';
import { LOCALE_ID } from '@angular/core';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';
import { OperationsComponent } from './operations/operations.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { AddChequeComponent } from './add-cheque/add-cheque.component';
import { RecouvrementComponent } from './recouvrement/recouvrement.component';
import { ConfirmationService } from 'primeng/api'; // Import ConfirmationService
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OperationsRecouvComponent } from './operations-recouv/operations-recouv.component';
import { AmenagementComponent } from './arrangement/arrangement.component';
import { EchancierComponent } from './echancier/echancier.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { PayerComponent } from './payer/payer.component';
import {SliderModule} from 'primeng/slider';
registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    UserComponent,
    LoginComponent,
    HeaderComponent,
    ForbiddenComponent,
    RoleComponent,
    RechercheComponent,
    OperationsComponent,
    ConsultationComponent,
    AddChequeComponent,
    RecouvrementComponent,
    OperationsRecouvComponent,
    AmenagementComponent,
    EchancierComponent,
    PayerComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SidebarModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    PasswordModule,
    AccordionModule,
    DialogModule,
    TableModule,
    RadioButtonModule,
    DropdownModule,
    ToastModule,
    CardModule,
    MessagesModule,
    CalendarModule,
    ConfirmDialogModule,
    SliderModule


  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    AuthGuard,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UserService,
    MessageService,
    ConfirmationService
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
