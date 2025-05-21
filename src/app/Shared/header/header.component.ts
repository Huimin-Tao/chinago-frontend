import { Component } from '@angular/core';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  open:boolean=false;

  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
    this.open = false;
  }

  get isAdmin():boolean{
    return this.auth.user?.usuario?.email_user === 'htao@uoc.edu';
  }


}
