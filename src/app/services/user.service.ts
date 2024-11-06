import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api';
  constructor(private http: HttpClient) { }

  // Get task by ID
  getTaskById(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/UserTasks/GetTaskById/${taskId}`);
  }

  // Get tasks by user ID
  getTasksByUserId(userId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.apiUrl}/UserTasks/GetTasksByUserId/${userId}`, { headers });
  }

  // Update task status
  updateTaskStatus(taskId: number, newStatus: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}/UserTasks/UpdateTaskStatus?taskId=${taskId}&newStatus=${encodeURIComponent(newStatus)}`;
    return this.http.put<any>(url, null, { headers, responseType: 'text' as 'json' });
  }

  // Get comments for a specific task
  getTaskComments(taskId: number): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any[]>(`${this.apiUrl}/UserTasks/GetTaskComments/${taskId}`, { headers });
  }

  // Add a comment to a task
  addCommentToTask(taskId: number, comment: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/UserTasks/AddCommentToTask?taskId=${taskId}`, comment, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  // Get the username for a specific comment
  getUserNameForComment(commentId: number): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<string>(`${this.apiUrl}/UserTasks/GetUserNameForComment/${commentId}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  // Getuser by ID
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/EditProfile/GetUserById/${userId}`);
  }

  editProfile(user: any): Observable<any> {
    if(user.password === null) user.password = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/EditProfile/EditProfile`, user, {
      headers,
      responseType: 'text' as 'json'
    });
  }
  isEmailUsed(userId: number, email: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<boolean>(`${this.apiUrl}/EditProfile/IsEmailUsed?email=${encodeURIComponent(email)}&userId=${userId}`, {
      headers
    });
  }
  isUsernameUsed(userId: number, username: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<boolean>(`${this.apiUrl}/EditProfile/IsUsernameUsed?username=${encodeURIComponent(username)}&userId=${userId}`, {
      headers
    });
  }
}
