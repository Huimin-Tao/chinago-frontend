import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormularioService } from '../formulario.service';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {
  form = this.fb.group({
    nombre:    this.fb.control<string>('', Validators.required),
    apellidos: this.fb.control<string>('', Validators.required),
    email:     this.fb.control<string>('', [Validators.required, Validators.email]),
    telefono:  this.fb.control<string>('', Validators.required),
    presupuesto: this.fb.control<string>('', Validators.required),
    destino:     this.fb.control<string>('', Validators.required),
    companeros:  this.fb.control<string>('', Validators.required),
    tipoHotel:   this.fb.control<string>('', Validators.required),
    comentarios: this.fb.control<string>(''),
    aceptar:     this.fb.control<boolean>(false, Validators.requiredTrue)
  });

  isSubmitting = false;

  presupuestos = [
    { label: '2000‑3000 €', value: '2000-3000' },
    { label: '3000‑4000 €', value: '3000-4000' },
    { label: '4000‑5000 €', value: '4000-5000' },
    { label: '5000+ €',       value: '5000+' }
  ];

  destinos = ['Beijing', 'Shanghai', 'Chengdu', 'Suzhou', 'Xi’an'];

  opcionesCompaneros = [
    { label: 'Familia', value: 'familia' },
    { label: 'Pareja',  value: 'pareja' },
    { label: 'Amigos',  value: 'amigos' },
    { label: 'Solo',    value: 'solo' }
  ];

  tiposHotel = [
    { label: '4‑5 estrellas',        value: '4-5' },
    { label: '3 estrellas estándar', value: '3'   },
    { label: 'Hotel Boutique',       value: 'boutique' },
    { label: 'Reserva por mi cuenta', value: 'independiente' }
  ];

  constructor(
    private fb: FormBuilder,
    private formSvc: FormularioService,
    private router: Router
  ) {}

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Mapeamos los campos del formulario al JSON que exige la API
    const payload = {
      nombre_cliente:      this.form.value.nombre,
      apellido_cliente:    this.form.value.apellidos,
      email_cliente:       this.form.value.email,
      telefono_cliente:    this.form.value.telefono,
      presupuesto:         this.form.value.presupuesto,
      ciudad:              this.form.value.destino,
      num_grupo:           this.form.value.companeros,
      hotel:               this.form.value.tipoHotel,
      comentario_cliente:  this.form.value.comentarios,
      estado_peticion:     'en proceso'  // o sacarlo de un control si lo tienes en el form
    };

    this.formSvc.send(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/gracias',this.form.value.nombre]);
      },
      error: err => {
        this.isSubmitting = false;
        console.error('Error enviando petición:', err);
      }
    });
  }
}
