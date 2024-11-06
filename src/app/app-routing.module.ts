import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { Error404Component } from './shared/error404/error404.component';
import { Error401Component } from './shared/error401/error401.component';
import { MyProfileComponent } from './shared/my-profile/my-profile.component';
import { RoleGuard } from './Auth/role.guard';
import { AuthGuard } from './Auth/auth.guard';
import { ChangeSuccessComponent } from './shared/change-success/change-success.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'user' }
  },
  { path: 'login', component: LoginComponent },
  { path: 'myProfile', component: MyProfileComponent },
  { path: '404', component: Error404Component },
  { path: 'UpdatedSuccessfully', component: ChangeSuccessComponent },
  { path: '401', component: Error401Component },
  { path: '**', redirectTo: '404' },
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
