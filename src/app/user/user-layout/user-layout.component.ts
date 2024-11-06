import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService, Notification } from 'src/app/services/notification.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  notifications: Notification[] = [];
  unreadNotificationsCount: number = 0;
  showNotifications: boolean = false;

  constructor(private notificationService: NotificationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(res => {
      this.notifications = res;
    });
    this.loadNotifications();
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotificationsCount = count;
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

    if (!this.showNotifications) {
      this.markAllAsRead(); 
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true; 
        if (notification.notificationId) {
          this.notificationService.markAsRead(notification.notificationId).subscribe({
            next: () => console.log(`Notification ${notification.notificationId} marked as read.`),
            error: err => console.error(`Error marking notification ${notification.notificationId} as read:`, err)
          });
        }
      }
    });

    
    this.notificationService.markAllAsRead();
  }

  loadNotifications() {
    this.notificationService.getNotificationsByUserId().subscribe({
      next: (res: Notification[]) => {
        this.notifications = res;
        this.notificationService.notifications = res; 
        this.notificationService.updateUnreadCount(); 
      },
      error: err => console.error('Error loading notifications:', err)
    });
  }

  onClickLogOut() {
    this.authService.Logout();
  }
}
