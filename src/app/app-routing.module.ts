import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthGuard } from './_auth/auth.guard';
import { RoleComponent } from './role/role.component';
import { RechercheComponent } from './recherche/recherche.component';


import { OperationsComponent } from './operations/operations.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { AddChequeComponent } from './add-cheque/add-cheque.component';
import { RecouvrementComponent } from './recouvrement/recouvrement.component';

import { OperationsRecouvComponent } from './operations-recouv/operations-recouv.component';
import { AmenagementComponent } from './arrangement/arrangement.component';
import { EchancierComponent } from './echancier/echancier.component';
import { PayerComponent } from './payer/payer.component';



const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "user", component: UserComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: "login", component: LoginComponent },
  { path: "forbidden", component: ForbiddenComponent },
  { path: "role", component: RoleComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: "recherche", component: RechercheComponent, canActivate: [AuthGuard], data: { roles: ['Frais'] } },
  { path: "operation", component: OperationsComponent, canActivate: [AuthGuard], data: { roles: ['ValiderFrais'] } },
  { path: "consultation", component: ConsultationComponent, canActivate: [AuthGuard], data: { roles: ['ValiderFrais', 'Admin', 'Frais', 'Recouvrement', 'ValiderRecouvrement'] } },
  { path: "cheque", component: AddChequeComponent, canActivate: [AuthGuard], data: { roles: ['Frais'] } },
  { path: "recouv", component: RecouvrementComponent, canActivate: [AuthGuard], data: { roles: ['Recouvrement'] } },
  { path: "operationRecouv", component: OperationsRecouvComponent, canActivate: [AuthGuard], data: { roles: ['ValiderRecouvrement'] } },
  { path: "amenagement", component: AmenagementComponent, canActivate: [AuthGuard], data: { roles: ['ValiderRecouvrement'] } },
  { path: "echancier", component: EchancierComponent, canActivate: [AuthGuard], data: { roles: ['ValiderRecouvrement'] } },
  { path: "payer", component: PayerComponent, canActivate: [AuthGuard], data: { roles: ['Recouvrement'] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
