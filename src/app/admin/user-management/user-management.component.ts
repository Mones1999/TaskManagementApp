import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

export interface UserWithLoginDTO {
  userId?: number;
  userLoginId?: number;
  username: string;
  password: string;
  role: string;
  email: string;
  fullName: string;
  status: string;
}

export interface ChangePasswordDTO {
  UserId: number;
  NewPassword: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: UserWithLoginDTO[] = [];
  currentUser: UserWithLoginDTO = {
    userId: 0,
    username: '',
    role: 'user',
    email: '',
    fullName: '',
    status: 'Active',
    password: ''
  };
  confirmPassword: string = '';
  filteredUsers: UserWithLoginDTO[] = [];
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isChangePasswordModalOpen: boolean = false;
  searchTerm: string = '';
  passwordMismatch: boolean = false;
  newPassword: string = '';
  confirmNewPassword: string = '';
  currentUserIdForPasswordChange: number = 0;
  changePasswordReq: ChangePasswordDTO = { UserId: 0, NewPassword: '' };
  isConfirmDeleteModalOpen: boolean = false;
  currentUserIdToDelete: number = 0;
  passwordStrengthMessage: string = '';
  newPasswordStrengthMessage: string = '';

  constructor(private adminService: AdminService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Check if email is in use by another user
  checkEmailInUse(): Promise<boolean> {
    return new Promise((resolve) => {
      this.adminService.isEmailInUseByAnotherUser(this.currentUser.userId!, this.currentUser.email).subscribe({
        next: (isInUse: boolean) => {
          resolve(isInUse);
        },
        error: () => {
          this.toastr.error('Error checking email');
          resolve(false);
        }
      });
    });
  }
  checkUsernameInUse(): Promise<boolean> {
    return new Promise((resolve) => {
      this.adminService.isUsernameInUseByAnotherUser(this.currentUser.userId!, this.currentUser.username).subscribe({
        next: (isInUse: boolean) => {
          resolve(isInUse);
        },
        error: () => {
          this.toastr.error('Error checking username');
          resolve(false);
        }
      });
    });
  }

  // Fetch all users
  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
      },
      error: () => {
        this.toastr.error('Error fetching users');
      }
    });
  }

  // Filter users based on search term
  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Open the Create User modal
  openCreateUserModal() {
    this.isModalOpen = true;
    this.passwordMismatch = false;
    this.currentUser = {
      userId: 0,
      username: '',
      role: 'user',
      email: '',
      fullName: '',
      status: 'Active',
      password: ''
    };
    this.confirmPassword = '';
    this.passwordStrengthMessage = '';
  }

  // Open the Edit User modal
  openEditUserModal(user: UserWithLoginDTO) {
    this.currentUser = { ...user };
    this.isEditModalOpen = true;
  }

  // Open the Change Password modal
  openChangePasswordModal(userId: number) {
    this.currentUserIdForPasswordChange = userId;
    this.isChangePasswordModalOpen = true;
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.newPasswordStrengthMessage = '';
  }

  // Close all modals
  closeModal() {
    this.isModalOpen = false;
    this.isEditModalOpen = false;
    this.isChangePasswordModalOpen = false;
    this.isConfirmDeleteModalOpen = false;
    this.passwordMismatch = false;
  }

  // Check if password and confirm password match
  checkPasswordMatch() {
    this.passwordMismatch = this.currentUser.password !== this.confirmPassword;
  }

  // Check if new password and confirm new password match
  checkNewPasswordMatch() {
    this.passwordMismatch = this.newPassword !== this.confirmNewPassword;
  }

  // Handle password input to determine strength
  onPasswordInput() {
    this.passwordStrengthMessage = this.checkPasswordStrength(this.currentUser.password);
  }
  // Function to handle password input and check strength
  onNewPasswordInput() {
    this.newPasswordStrengthMessage = this.checkPasswordStrength(this.newPassword);
    this.checkNewPasswordMatch(); // Also check if passwords match whenever password input changes
  }
  // Check password strength
  checkPasswordStrength(password: string): string {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
      return 'Weak'; // Password does not meet criteria
    }
    if (password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar) {
      return 'Strong'; // Meets all criteria
    }
    return 'Moderate'; // Password is moderate if it partially meets criteria
  }

  // Create a new user
  async createUser() {
    const isEmailInUse = await this.checkEmailInUse();
    if (isEmailInUse) {
      this.toastr.error('Email is already in use by another user');
      return;
    }

    const isUsernameInUse = await this.checkUsernameInUse();
    if (isUsernameInUse) {
      this.toastr.error('Username is already in use by another user');
      return;
    }

    if (this.passwordStrengthMessage === 'Weak' || this.passwordMismatch) {
      this.toastr.error('Password does not meet the strength requirements or does not match');
      return;
    }

    this.adminService.createUserWithLogin(this.currentUser).subscribe({
      next: () => {
        this.closeModal();
        this.loadUsers();
        this.toastr.success('User created successfully');
      },
      error: (err) => {
        this.toastr.error(err.error);
      }
    });
  }

  // Update an existing user
  async updateUser() {
    const isEmailInUse = await this.checkEmailInUse();
    if (isEmailInUse) {
      this.toastr.error('Email is already in use by another user');
      return;
    }

    const isUsernameInUse = await this.checkUsernameInUse();
    if (isUsernameInUse) {
      this.toastr.error('Username is already in use by another user');
      return;
    }

    this.adminService.updateUserWithLogin(this.currentUser).subscribe({
      next: () => {
        this.closeModal();
        this.loadUsers();
        this.toastr.success('User updated successfully');
      },
      error: (err) => {
        this.toastr.error(err.error);
        console.log(err);
      }
    });
  }

  // Change user password
  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }
    this.changePasswordReq.UserId = this.currentUserIdForPasswordChange;
    this.changePasswordReq.NewPassword = this.newPassword;
    this.adminService.changePassword(this.changePasswordReq).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
        this.toastr.success('Password changed successfully');
      },
      error: (err) => {
        this.toastr.error(err);
        console.log(err);
      }
    });
  }

  // Open the delete confirmation modal
openConfirmDeleteModal(userId: number) {
  this.currentUserIdToDelete = userId;
  this.isConfirmDeleteModalOpen = true;
}

// Close the delete confirmation modal
closeConfirmDeleteModal() {
  this.isConfirmDeleteModalOpen = false;
  this.currentUserIdToDelete = 0;
}

// Delete the user
deleteUser() {
  if (this.currentUserIdToDelete) {
    this.adminService.deleteUserWithLogin(this.currentUserIdToDelete).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully');
        this.loadUsers(); // Refresh the user list after deletion
        this.closeConfirmDeleteModal();
      },
      error: (err) => {
        this.toastr.error(`Error deleting user: ${err.error.message}`);
      }
    });
  }
}

}
