import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';
import { userNavbarItems, adminNavbarItems, contencieuxNavbarItems } from '../navbar-items'; // Import navbar items
import { RoleService } from '../_services/role.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
   

  navbarItems: any[] = [];
  timeOfLogin: Date = new Date();
  roles: string[] = [];

  sidebarVisible: boolean = false;
  

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService, 
    private roleService : RoleService
  ) {}

  ngOnInit(): void {
this.save();
    this.saveItemsNavbar();
    const timeOfLogout = new Date();

  }

  hideSidebar() {
    this.sidebarVisible = false;
}

  showSidebar() {
    this.sidebarVisible = true;
}
  saveItemsNavbar() {
    this.roles = this.userAuthService.getRoles();
    this.navbarItems = []; // Assurez-vous de réinitialiser navbarItems à chaque appel de la méthode
  
    if (this.userService.roleMatch('Admin')) {
      this.navbarItems = this.navbarItems.concat(adminNavbarItems);
    } 
    if (this.userService.roleMatch('User')) {
      this.navbarItems = this.navbarItems.concat(userNavbarItems);
    } 
    else if (this.userService.roleMatch('Contencieux')) {
      this.navbarItems = this.navbarItems.concat(contencieuxNavbarItems);
    } 

    return this.navbarItems ; 
  }


  save() {
    console.log(this.navbarItems); 

    
  }




  public isLoggedIn() {
    this.timeOfLogin = new Date();
    return this.userAuthService.isLoggedIn();
  }

  

  public logout() {
    this.save();
    this.userAuthService.clear();
    this.router.navigate(['/home']);
  }

}