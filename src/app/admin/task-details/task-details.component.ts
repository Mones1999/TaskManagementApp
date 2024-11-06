import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'highcharts';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

interface Comments{
  CommentId?: number;
  UserId: number;
  Text: string;
  Timestamp: Date;
  User: any;
}

interface Task {
  taskId?: number;
  title: string;
  description: string;
  assignedUserId: number;
  status: string;
  dueDate: string;
  assignedUserName?: string; 
}

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  taskId: number = 0;
  task: Task | undefined;
  comments: any;
  newCommentText: string = '';


  // Pagination properties
  currentPage: number = 1;
  commentsPerPage: number = 3;
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
  }
  ngOnInit(): void {
      this.route.paramMap.subscribe((param) => {
      this.taskId = Number(param.get('taskId'));
      this.loadTaskDetails(this.taskId);
      this.loadComments(this.taskId)

    });
    
  }
  loadTaskDetails(taskId: number) {
    this.adminService.getTaskById(taskId).subscribe(
      task => {
        this.task = task;
        this.loadAssignedUser(task)
      },
      error => console.error('Error fetching task details:', error)
    );
  }

  loadAssignedUser(task: Task) {
    this.adminService.getUserById(task.assignedUserId).subscribe(user => {
      task.assignedUserName = user.username;
    });
  }

  loadComments(taskId: number){
    this.adminService.getTaskComments(taskId).subscribe(res => {
      this.comments = res;
      this.comments.forEach((comment: any) => this.loadUserNameForComment(comment));
      console.log(res);
      
    });
  }
  loadUserNameForComment(comment: { commentId: number; User: string; }): any{
    this.adminService.getUserNameForComment(comment.commentId!).subscribe(res=> {comment.User = res; console.log(res);
    });
  }
  addComment(): void {
    if (this.newCommentText.trim()) {
      const newComment: Comments = {

        Text: this.newCommentText,
        Timestamp: new Date(),
        UserId: this.authService.getTokenDecoded().userId,
        User: undefined
      };
      this.adminService.addCommentToTask(this.taskId, newComment).subscribe(
        ()=> {
          this.toastr.success("Comment Added Successfully");
          this.loadComments(this.taskId);
          console.log(this.comments);
        },
        (error)=>{
          this.toastr.error(`Could Not Add Comment: ${error.message}`);
        }
      );;
      this.comments?.push(newComment);
      this.newCommentText = '';
    }
  }

  // Method to get comments for the current page
  get paginatedComments() {
    const start = (this.currentPage - 1) * this.commentsPerPage;
    const end = start + this.commentsPerPage;
    return this.comments.slice(start, end);
  }

  // Method to navigate to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Method to navigate to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Get the total number of pages based on comments and comments per page
  get totalPages(): number {
    return Math.ceil(this.comments.length / this.commentsPerPage);
  }
}
