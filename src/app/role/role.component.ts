import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RoleService } from '../_services/role.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  role: any = [];
  displayRoleModal: boolean = false;

  roleName: string = '';
  roleDescription: string = '';
  constructor(private roleService: RoleService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.fetchRoles();
  }

  isFieldValid(fieldValue: string): boolean {
    const pattern: RegExp = /^[A-Za-z\s]+$/; // Allow only letters and spaces
    return pattern.test(fieldValue);
  }
  showRoleModal() {
    this.displayRoleModal = true;
  }

  hideRoleModal() {
    this.displayRoleModal = false;
  }

  fetchRoles() {
    this.roleService.getAllRoles().subscribe(
      (roles: any[]) => {
        this.role = roles;
      },
      (error) => {
        console.error('Error affiche les  roles:', error);
      }
    );
  }



  createRole(createRoleForm: NgForm) {
    if (createRoleForm.valid) {
      this.roleService.createNewRole(createRoleForm.value).subscribe(
        (response) => {
          console.log('Role registered successfully:', response);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Rôle créé avec succès'});
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          console.error('Erreur lors de l\'enregistrement du rôle :', error);
          // Handle error, show error message, etc.
        }
      );
    } else {
      console.error('Le formulaire est invalide.');
    }
  }




}
