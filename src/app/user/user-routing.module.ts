import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { UserTaskDetailsComponent } from './user-task-details/user-task-details.component';


const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'myTasks', pathMatch: 'full' },
      { path: 'myTasks/:taskId', component: UserTaskDetailsComponent },
      { path: 'myTasks', component: MyTasksComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
