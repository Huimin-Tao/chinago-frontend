import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form = this.fb.group({
    email_user: ['', [Validators.required, Validators.email]],
    password_user: ['', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting:boolean=false;
  errorMessage:string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const { email_user, password_user } = this.form.value as { email_user: string; password_user: string };

    this.auth.login({ email_user, password_user }).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas.';
        this.isSubmitting = false;
      }
    });
  }

}
