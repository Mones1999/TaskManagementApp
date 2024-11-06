import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { FormsModule } from '@angular/forms';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { UserTaskDetailsComponent } from './user-task-details/user-task-details.component';


@NgModule({
  declarations: [
    UserSidebarComponent,
    UserLayoutComponent,
    MyTasksComponent,
    UserTaskDetailsComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule
  ],
  exports: [
    UserSidebarComponent, 
    UserSidebarComponent
  ]
})
export class UserModule { }
