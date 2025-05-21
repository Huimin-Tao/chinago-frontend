import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CmsGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn && this.auth.user?.usuario?.email_user === 'htao@uoc.edu') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}