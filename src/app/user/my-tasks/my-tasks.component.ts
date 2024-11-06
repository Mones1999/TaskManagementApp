import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
interface Comment {
  id: number;
  user: string;
  text: string;
  timestamp: Date;
}


@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent {
  myTasks: any;
  selectedTask?: any;
  newCommentText: string = '';
  userId = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    
  }

  ngOnInit(): void {
    this.userId = Number(this.authService.getTokenDecoded().userId);
    this.loadTasks(this.userId);
}
  loadTasks(userId: number){
    this.userService.getTasksByUserId(userId).subscribe(tasks=> this.myTasks = tasks);
  }
}
