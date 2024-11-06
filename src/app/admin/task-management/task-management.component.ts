import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';



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
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css']
})
export class TaskManagementComponent implements OnInit {
  tasks: Task[] = [];
  isTaskModalOpen = false;
  isTaskDetailOpen = false;
  isEditing = false;
  currentTask: Task;
  selectedTask?: Task;
  users: any;
  isConfirmDeleteModalOpen: boolean = false;
  dueDateError = false;
  today = new Date().toISOString().split('T')[0];

  constructor(private adminService: AdminService, private toastr: ToastrService) {
    this.currentTask = this.initializeNewTask();
  }

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
  }

  // Load all tasks
  loadTasks() {
    this.adminService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.tasks.forEach(task => this.loadAssignedUser(task));
    });
  }

  loadAssignedUser(task: Task) {
    this.adminService.getUserById(task.assignedUserId).subscribe(user => {
      task.assignedUserName = user.username;
    });
  }

  // Fetch all users
  loadUsers() {
    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
      console.log(users);
      
    });
  }

  // Open modal for adding a new task
  openAddTaskModal() {
    this.isTaskModalOpen = true;
    this.isEditing = false;
    this.currentTask = this.initializeNewTask();
    this.currentTask.assignedUserId = 0;
  }

  // Open modal for editing an existing task
  openEditTaskModal(task: Task) {
    this.isTaskModalOpen = true;
    this.isEditing = true;
    this.currentTask = {
      ...task,
      dueDate: this.formatDate(task.dueDate)
    };
    console.log(this.currentTask);
    
    this.validateDueDate();
  }

  // Validate the Due Date
  validateDueDate() {
    const selectedDate = new Date(this.currentTask.dueDate);
    const todayDate = new Date(this.today);
    this.dueDateError = selectedDate <= todayDate;
  }

  // Close modal
  closeTaskModal() {
    this.isTaskModalOpen = false;
    this.dueDateError = false;
  }

  // Create a new task
  createTask() {
    if (!this.dueDateError) {
      this.adminService.createTask(this.currentTask).subscribe(
        () => {
          this.toastr.success("Task Created Successfully");
          this.loadTasks();
          this.closeTaskModal();
        },
        (error) => {
          this.toastr.error(`Could not create task: ${error.message}`);
        }
      );
    }
  }

  // Update an existing task
  updateTask() {
    if (!this.dueDateError) {
      this.adminService.updateTask(this.currentTask).subscribe(
        () => {
          this.toastr.success("Task Updated Successfully");
          this.loadTasks();
          this.closeTaskModal();
        },
        (error) => {
          this.toastr.error(`Could Not Update Task: ${error.message}`);
        }
      );
    }
  }

  // Confirm deletion of a task
  confirmDeleteTask(task: Task) {
    this.currentTask = { ...task };
    this.isConfirmDeleteModalOpen = true;
  }

  closeConfirmDeleteModal() {
    this.isConfirmDeleteModalOpen = false;
  }

  // Delete a task
  deleteTask() {
    this.adminService.deleteTask(this.currentTask.taskId!).subscribe(
      () => {
        this.loadTasks();
        this.toastr.info("Task Deleted Successfully");
        this.closeConfirmDeleteModal();
      },
      (error) => {
        this.toastr.error(`Could Not delete the task: ${error.message}`);
      }
    );
  }

  // Load task details and comments
  openTaskDetail(task: Task) {
    this.adminService.getTaskById(task.taskId!).subscribe(taskDetails => {
      this.selectedTask = taskDetails;
      this.isTaskDetailOpen = true;
    });
  }

 // Initialize a new task with the due date set to tomorrow
initializeNewTask(): Task {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Add one day to today's date

  return {
    taskId: 0,
    title: '',
    description: '',
    assignedUserId: 0,
    status: 'In Progress',
    dueDate: tomorrow.toISOString().split('T')[0], // Format as 'yyyy-MM-dd'
  };
}


  // Format the date to 'yyyy-MM-dd' for input display
  formatDate(date: string): string {
    const localDate = new Date(date);
    // Adjust date to avoid timezone issues
    return new Date(localDate.getTime() + Math.abs(localDate.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];
  }

}
