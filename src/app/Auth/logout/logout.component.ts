import { Component } from '@angular/core';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(private auth: AuthService) {}

  confirmLogout() {
    this.auth.logout();
  }
}
