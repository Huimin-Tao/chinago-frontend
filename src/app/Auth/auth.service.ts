import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private user$ = new BehaviorSubject<User | null>(this.getStoredUser());
  readonly currentUser$ = this.user$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email_user: string; password_user: string }) {
    return this.http.post<User>(environment.apiUrl + '/api/usuarios/login', credentials).pipe(
      tap(user => {
        this.persist(user);
        this.user$.next(user);
      })
    );
  }

  signup(dto: { name_user: string; lastname_user: string; email_user: string; password_user: string }) {
    return this.http.post<User>(environment.apiUrl + '/api/usuarios/register', dto).pipe(
      tap(user => {
        this.persist(user);
        this.user$.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('chinago_user');
    this.user$.next(null);
    this.router.navigate(['/']);
  }

  updateProfile(dto: { name_user: string; lastname_user: string; email_user: string }): Observable<User> {
    return this.http.put<User>(environment.apiUrl + '/api/usuarios/' + this.user?.usuario.id_usuario , dto).pipe(
      tap(user => {
        this.persist(user);
        this.user$.next(user);
      })
    );
  }

  get user(): User | null {
    return this.user$.value;
  }

  get isLoggedIn(): boolean {
    return !!this.user$.value?.token;
  }

  private persist(user: User) {
    localStorage.setItem('chinago_user', JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('chinago_user');
    return stored ? JSON.parse(stored) : null;
  }
}
