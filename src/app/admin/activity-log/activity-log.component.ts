import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
  activityLogs: any[] = [];
  filteredLogs: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Filter properties
  selectedUserId: number | null = null; // Set to null to include all users by default
  selectedAction: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  dateError: boolean = false;

  actions: string[] = ['Create', 'Update', 'Delete', 'Login', 'Logout'];
  users: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadAllLogs(); // Load all logs initially
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  // Load all logs without filters initially
  loadAllLogs(): void {
    this.adminService.getFilteredActivityLogs().subscribe(
      (logs) => {
        this.activityLogs = logs;
        this.filteredLogs = logs;
        this.currentPage = 1; // Reset to the first page
      },
      (error) => {
        console.error('Error fetching activity logs:', error);
      }
    );
  }

  // Validate date range
  validateDates(): void {
    if (this.dateFrom && this.dateTo) {
      this.dateError = new Date(this.dateFrom) > new Date(this.dateTo);
    } else {
      this.dateError = false;
    }
  }

  // Apply filters and call API to get filtered logs
  applyFilters(): void {
    if (this.dateError) {
      return;
    }

    // Pass `null` for `userId` if `selectedUserId` is not selected (all users)
    this.adminService.getFilteredActivityLogs(
      this.selectedUserId ? this.selectedUserId : undefined,
      this.selectedAction,
      this.dateFrom,
      this.dateTo
    ).subscribe(
      (logs) => {
        this.activityLogs = logs;
        this.filteredLogs = logs;
        this.currentPage = 1; // Reset to the first page
      },
      (error) => {
        console.error('Error fetching filtered logs:', error);
      }
    );
  }

  get paginatedLogs() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredLogs.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
