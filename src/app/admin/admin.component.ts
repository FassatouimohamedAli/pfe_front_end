import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { RoleService } from '../_services/role.service';
import 'bootstrap';
import { UserAuthService } from '../_services/user-auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  selectedUser: any = {};
  oldRole: string = '';
  newRole: string = '';
  currentPage: number = 0;
  pageSize: number = 3;
  firstName: string = '';
  searchFirstName = '';


  displayUpdateModal: boolean = false;
  displayAddRoleModal: boolean = false;
  displayDeleteRoleModal: boolean = false;

  paginationTemplate = 'Showing {first} to {last} of {totalRecords} users';

  constructor(private userService: UserService,
    private roleService: RoleService, private userAuthService : UserAuthService) { }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();

  }

  //paginationTemplate = 'Page {currentPage} of {totalPages}';
  fetchUsers() {
    this.userService.getAllUsers().subscribe(
      (users: any[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
 

  fetchRoles() {
    this.roleService.getAllRoles().subscribe(
      (roles: any[]) => {
        this.roles = roles;

      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );


  }

  openUpdateModal(user: any) {
    this.selectedUser = { ...user }; // Make a copy of the user object
    this.oldRole = '';
    if (user.role.length === 1) {
      this.oldRole = user.role[0].roleName; // Set the old role to the only role available
    } // Reset selected role when opening modal
  }

  UpdateModal(user: any) {
    // Vous pouvez ajouter ici la logique pour pré-remplir les champs du modal
    this.displayUpdateModal = true;
    this.openUpdateModal(user);
  }
  closeModal() {
    this.displayDeleteRoleModal = false;
    this.displayAddRoleModal = false;
    this.displayUpdateModal = false;

  }

  openAddRoleModal(user: any) {
    // Logique pour ouvrir le modal Add Role
    this.displayAddRoleModal = true;
    this.openUpdateModal(user);
  }

  openDeleteRoleModal(user: any) {
    // Logique pour ouvrir le modal Delete Role
    this.displayDeleteRoleModal = true;
    this.openUpdateModal(user);
  }

  AddUserRoles() {
    this.userService.AddRole(this.selectedUser.userName, this.newRole).subscribe(
      (response) => {
        console.log('User roles add successfully:', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error adding user roles:', error);
        // Handle error, show an error message, or provide appropriate feedback to the user
      }
    );

  }


  updateUserRoles() {
    if (this.oldRole && this.newRole && this.oldRole !== this.newRole) {
      // Call your service method to update user roles only if the roles are different
      this.userService.UpdateRole(this.selectedUser.userName, this.oldRole, this.newRole).subscribe(
        (response) => {
          console.log('User roles updated successfully:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error updating user roles:', error);
          // Handle error, show an error message, or provide appropriate feedback to the user
        }
      );
    } else {
      console.error('Please select both old and new roles, and make sure they are different.');
      // Display a message to the user indicating that both old and new roles must be selected and different
    }
  }

  deleteRole() {
    if (this.selectedUser && this.oldRole) {
      // Explicitly call deleteRole() to remove the role from the user
      this.userService.deleteRole(this.selectedUser.userName, this.oldRole).subscribe(
        (response) => {
          console.log('User role deleted successfully:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error deleting user role:', error);
          console.log('Error details:', error.error); // Log the error details
          // Handle error, show an error message, or provide appropriate feedback to the user
        }
      );
    } else {
      console.error('User or role not selected.');
      // Handle error, show an error message, or provide appropriate feedback to the user
    }
  }










}


