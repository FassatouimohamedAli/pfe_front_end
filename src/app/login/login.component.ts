import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; // Import NgForm
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  password: string = '';

 
  errorMessage: string = '';
  constructor(private userService: UserService, private userAuthService: UserAuthService
    , private router: Router) { }

  ngOnInit(): void {
  }


  Login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);
        this.userAuthService.setUsername(response.user.userName);
        const role = response.user.role[0].roleName;
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else  if (role === 'Frais') {
          this.router.navigate(['/recherche']);
        }else if (role == 'ValiderFrais'){
          this.router.navigate(['/operation']);
        }else if (role == 'Recouvrement'){
          this.router.navigate(['/recouv']);
        }else if (role == 'ValiderRecouvrement'){
          this.router.navigate(['/operationRecouv']);
        }

      },

      (Error) => {
        if (Error.status === 401) {
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        } else {
          this.errorMessage = 'Une erreur inattendue s\'est produite. Veuillez réessayer ultérieurement.';
      }
    }
    );
  }


}
