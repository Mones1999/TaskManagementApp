import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  user: any;
  confirmNewPassword: string = '';
  emailTaken: boolean = false;
  usernameTaken: boolean = false;
  passwordValid: boolean = true;
  userId: number = 0;

  constructor(private userService: UserService, private toastr: ToastrService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userId = Number(this.authService.getTokenDecoded().userId);
    this.loadCurrentUser(this.userId);
  }

  loadCurrentUser(userId: number) {
    this.userService.getUserById(userId).subscribe(res => this.user = res);
  }

  checkEmailUniqueness() {
    // Implement email uniqueness check here
  }

  checkUsernameUniqueness() {
    // Implement username uniqueness check here
  }

  validatePasswordStrength() {
    const password = this.user.password || '';
    // Password is valid if it's empty (optional) or meets strength requirements
    this.passwordValid = password === '' || (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  }

  onSubmit() {
    // Skip new password and confirm password validation if no new password is entered
    if (this.emailTaken || this.usernameTaken || !this.passwordValid ||
      (this.user.password && this.confirmNewPassword !== this.user.password)) {
      this.toastr.error('Please correct the errors before submitting.');
      return;
    }

    this.userService.editProfile(this.user).subscribe(
      ()=> {
        this.toastr.success('Your profile updated successfully');
        this.router.navigate(['/UpdatedSuccessfully']);
      },
      (error) => {
        this.toastr.error(error.message);
        console.log(error);
        
      }
    );
  }
}
