import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-success',
  templateUrl: './change-success.component.html',
  styleUrls: ['./change-success.component.css']
})
export class ChangeSuccessComponent {
  link = ''
  userRole = ''
  constructor(private authService: AuthService){}

  ngOnInit(){
    this.assignLink(this.authService.getTokenDecoded().userRole)
  }

  assignLink(Role: string){
    if(Role === 'admin'){
      this.link = '/admin'
    }else{
      this.link = '/user'
    }
  }
}
