import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  form = this.fb.group({
    nombre: this.fb.control<string>('', Validators.required),
    apellidos: this.fb.control<string>('', Validators.required),
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.control<string>('', Validators.required),
    aceptar: this.fb.control<boolean>(false, Validators.requiredTrue)
  });

  isSubmitting:boolean=false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;

    const { nombre, apellidos, email, password } = this.form.value as {
      nombre: string;
      apellidos: string;
      email: string;
      password: string;
    };

    this.auth.signup({ name_user: `${nombre}`,lastname_user: `${apellidos}`, email_user: `${email}`, password_user: `${password}` }).subscribe(() => {
      this.router.navigate(['/login']);
    }, () => {
      this.isSubmitting = false;
    });
  }
}
