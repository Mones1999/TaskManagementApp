import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Notification {
  notificationId?: number;
  message: string;
  isRead: boolean;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  public notifications: Notification[] = [];

  // Observable for unread count
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private apiUrl = 'http://localhost:5000/api';

  constructor(private authService: AuthService, private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/notificationHub', {
        accessTokenFactory: () => {
          const token = this.authService.getToken();
          if (!token) {
            console.error('No access token found. Please log in.');
            return "";
          }
          return token;
        }
      })
      .withAutomaticReconnect()
      .build();

    this.startConnection();
    this.addNotificationListener();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.log('Error while starting SignalR connection: ' + err));
  }

  private addNotificationListener() {
    this.hubConnection.on('ReceiveNotification', (notificationData: any) => {
      console.log('Raw notification data:', notificationData);

      try {
        const notification: Notification = {
          notificationId: notificationData.notificationId,
          message: notificationData.message,
          isRead: notificationData.isRead,
          createdDate: notificationData.createdDate
        };
        console.log('New notification:', notification);

        // Add the new notification to the beginning of the array
        this.notifications.unshift(notification);
        this.notificationsSubject.next(this.notifications); // Notify subscribers
        this.updateUnreadCount();
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    });
  }

  public updateUnreadCount() {
    const unreadCount = this.notifications.filter(notification => !notification.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  markAllAsRead() {
    this.notifications.forEach(notification => (notification.isRead = true));
    this.updateUnreadCount();
  }

  getNotificationsByUserId(): Observable<any> {
    const userId = Number(this.authService.getTokenDecoded().userId);
    return this.http.get<any>(`${this.apiUrl}/Notification/GetUserNotification/${userId}`);
  }

  markAsRead(notificationId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/Notification/MarkAsRead/${notificationId}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }
}
