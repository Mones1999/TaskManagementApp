import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { UserManagementComponent } from './user-management/user-management.component';
import { FormsModule } from '@angular/forms';
import { TaskManagementComponent } from './task-management/task-management.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TaskDetailsComponent } from './task-details/task-details.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminSidebarComponent,
    AdminLayoutComponent,
    UserManagementComponent,
    TaskManagementComponent,
    ActivityLogComponent,
    TaskDetailsComponent,
   
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HighchartsChartModule,
    FormsModule,
    ToastrModule.forRoot({
        timeOut: 10000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
      }),
  ],
  exports: [
    AdminSidebarComponent, 
    AdminSidebarComponent
  ]
})
export class AdminModule { }
