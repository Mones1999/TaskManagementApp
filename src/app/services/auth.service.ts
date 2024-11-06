import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(
    private http: HttpClient,
    public toastr: ToastrService,
    private router: Router,
  ) {}

  Login(loginDetails: any) {
    this.http.post(`http://localhost:5000/api/Authentication/Login`, loginDetails).subscribe(
      (res: any) => {
        if (res.token) {
          localStorage.setItem('token', JSON.stringify(res.token));
          const tokenPayload: any = jwtDecode(res.token);
          const userRole: string = tokenPayload.userRole;
          this.isLoggedInSubject.next(true);
          this.HandleNavigate(userRole);

        } else {
          setTimeout(() => {
            this.toastr.error('Please try again!', 'Invalid login response format');
          }, 1000);
        }
      },
      (error) => {
        if (error.status === 401) {
          setTimeout(() => {
            this.toastr.error('Please try again!', 'Wrong login credentials');
          }, 1000);
        }
      }
    );
  }

  getToken(): any {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  }

  Logout() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post(`http://localhost:5000/api/Authentication/Logout`, null, {headers, responseType: 'text' as 'json'}).subscribe(
      ()=>{
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
      },
      (error) =>{
        console.log(error);
        
      }
    );
    
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  HandleNavigate(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'user') {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/']);
    }
  }
  getTokenDecoded(): any {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
  }
}
