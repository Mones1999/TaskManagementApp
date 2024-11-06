import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
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
  selector: 'app-user-task-details',
  templateUrl: './user-task-details.component.html',
  styleUrls: ['./user-task-details.component.css']
})
export class UserTaskDetailsComponent {
  taskId: number = 0;
  task: Task | undefined;
  comments: any;
  newCommentText: string = '';
  isStatusModalOpen: boolean = false;
  selectedStatus: string = '';
  availableStatuses: string[] = ['Pending', 'In Progress', 'Completed'];

  // Pagination properties
  currentPage: number = 1;
  commentsPerPage: number = 3;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
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
    this.userService.getTaskById(taskId).subscribe(
      task => {
        this.task = task;
        
      },
      error => console.error('Error fetching task details:', error)
    );
  }

  

  loadComments(taskId: number){
    this.userService.getTaskComments(taskId).subscribe(res => {
      this.comments = res;
      this.comments.forEach((comment: any) => this.loadUserNameForComment(comment));
      console.log(res);
      
    });
  }
  loadUserNameForComment(comment: { commentId: number; User: string; }): any{
    this.userService.getUserNameForComment(comment.commentId!).subscribe(res=> {comment.User = res; console.log(res);
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
      this.userService.addCommentToTask(this.taskId, newComment).subscribe(
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

  // Open the status update modal
  openStatusModal() {
    this.isStatusModalOpen = true;
    this.selectedStatus = this.task?.status || ''; // Set to current task status
  }

  // Close the status update modal
  closeStatusModal() {
    this.isStatusModalOpen = false;
  }

  // Update task status
  updateTaskStatus() {
    if (this.task && this.selectedStatus) {
      this.userService.updateTaskStatus(this.task.taskId!, this.selectedStatus).subscribe(
        () => {
          this.toastr.success('Task status updated successfully');
          this.task!.status = this.selectedStatus; // Update local task status
          this.closeStatusModal(); // Close the modal
        },
        error => {
          this.toastr.error(`Could not update status: ${error.message}`);
        }
      );
    }
  }

  // Method to get comments for the current page
  get paginatedComments() {
    const start = (this.currentPage - 1) * this.commentsPerPage;
    const end = start + this.commentsPerPage;
    return this.comments?.slice(start, end);
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
    return Math.ceil((this.comments?.length || 0) / this.commentsPerPage);
  }
}
