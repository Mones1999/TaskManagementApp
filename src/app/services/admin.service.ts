import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Users APIs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/User/GetAllUsersWithLogin`);
  }

  getUserById(userId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.apiUrl}/User/GetUserWithLogin/${userId}`);
  }

  createUserWithLogin(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/User/CreateUserWithLogin`, user, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  updateUserWithLogin(user: any): Observable<any> {
    user.password = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/User/UpdateUserWithLogin`, user, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  changePassword(changePassword: any): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<string>(`${this.apiUrl}/User/ChangePassword`, changePassword, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  deleteUserWithLogin(id: number): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<string>(`${this.apiUrl}/User/DeleteUserWithLogin/${id}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  isEmailInUseByAnotherUser(userId: number, email: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<boolean>(`${this.apiUrl}/User/IsEmailInUseByAnotherUser?email=${encodeURIComponent(email)}&userId=${userId}`, {
      headers
    });
  }
  isUsernameInUseByAnotherUser(userId: number, username: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<boolean>(`${this.apiUrl}/User/IsUsernameInUseByAnotherUser?username=${encodeURIComponent(username)}&userId=${userId}`, {
      headers
    });
  }

  // Dashboard Statistics APIs

  getNumberOfUsers(): Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.apiUrl}/AdminDashboard/GetNumberOfUsers`, { headers });
  }

  getNumberOfTasks(): Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.apiUrl}/AdminDashboard/GetNumberOfTasks`, { headers });
  }

  getNumberOfCompletedTasks(): Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.apiUrl}/AdminDashboard/GetNumberOfCompletedTasks`, { headers });
  }

  getNumberOfPendingTasks(): Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.apiUrl}/AdminDashboard/GetNumberOfPendingTasks`, { headers });
  }

  getUsersByTopNumberOfTasks(numberOfUser: number = 5): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any[]>(`${this.apiUrl}/AdminDashboard/GetUsersByTopNumberOfTasks?numberOfUser=${numberOfUser}`, { headers });
  }

  // Tasks APIs
  getAllTasks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Task`);
  }

  getTaskById(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Task/${taskId}`);
  }

  createTask(task: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/Task/CreateTask`, task, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  updateTask(task: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/Task`, task, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  deleteTask(taskId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/Task/${taskId}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  getTaskComments(taskId: number): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any[]>(`${this.apiUrl}/Task/${taskId}/comments`, {
      headers,
      responseType: 'json'
    });
  }

  getUserNameForComment(commentId: number): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<string>(`${this.apiUrl}/Task/getUserNameForComment/${commentId}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  addCommentToTask(taskId: number, comment: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/Task/${taskId}/comments`, comment, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  // Logs API
  getLogs(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.apiUrl}/Logs`, {
      headers,
      responseType: 'json'
    });
  }

  getFilteredActivityLogs(userId?: number, action?: string, dateFrom?: string, dateTo?: string): Observable<any[]> {
    let params = new HttpParams();
    
    if (userId !== undefined && userId !== null) {
      params = params.set('userId', userId.toString());
    }
    if (action) {
      params = params.set('action', action);
    }
    if (dateFrom) {
      params = params.set('dateFrom', dateFrom);
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo);
    }

    return this.http.get<any[]>(`${this.apiUrl}/Logs/GetFilteredActivityLogs`, { params });
  }
}
