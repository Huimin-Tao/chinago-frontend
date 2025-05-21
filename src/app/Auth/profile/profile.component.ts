import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user = this.auth.user;
  isSubmitting: boolean = false;

  form = this.fb.group({
    nombre: this.fb.control<string>('', Validators.required),
    apellidos: this.fb.control<string>('', Validators.required),
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    if (this.user) {
      this.form.patchValue({
        nombre: this.user.usuario.name_user,
        apellidos: this.user.usuario.lastname_user,
        email: this.user.usuario.email_user
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.isSubmitting = true;

    const { nombre, apellidos, email } = this.form.getRawValue();

    this.auth.updateProfile({
      name_user: nombre!,
      lastname_user: apellidos!,
      email_user: email!
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Perfil actualizado exitosamente.');
      },
      error: () => {
        this.isSubmitting = false;
        alert('Error al actualizar el perfil.');
      }
    });
  }
}
