import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { Error404Component } from './error404/error404.component';
import { Error401Component } from './error401/error401.component';
import { FormsModule } from '@angular/forms';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ChangeSuccessComponent } from './change-success/change-success.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LoginComponent,
    Error404Component,
    Error401Component,
    MyProfileComponent,
    ChangeSuccessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  exports: [
    LoginComponent,
    Error404Component,
    Error401Component,
    MyProfileComponent
  ]
})
export class SharedModule { }
