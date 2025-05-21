import { Component, OnInit} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CmsService } from '../../service/cms.service';
import { Lead } from '../../models/lead.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrl: './gestion-clientes.component.css',
  animations: [
    trigger('state', [
      state('done', style({ opacity: 1 })),
      state('pending', style({ opacity: 0.5 })),
      transition('pending => done', animate('300ms ease-in')),
    ])
  ]
})
export class GestionClientesComponent implements OnInit{

  displayedColumns: string[] = [
    'index', 'name', 'lastname', 'email', 'telefono', 'presupuesto',
    'ciudad', 'naturaleza', 'plan', 'estado', 'action'
  ];
  dataSource: Lead[] = [];
  loading = false;
  error = '';

  constructor(
    private CmsService: CmsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchLeads();
  }

  fetchLeads() {
    this.loading = true;
    this.CmsService.getAll().subscribe({
      next: data => { this.dataSource = data; this.loading = false; },
      error: err => { this.error = err.message; this.loading = false; }
    });
  }

  onToggleStatus(lead: Lead) {
    const nuevoEstado = lead.estado_peticion === 'en proceso' ? 'contactado' : 'en proceso';
    this.CmsService.updateStatus(lead.id_cliente, nuevoEstado)
      .subscribe({
        next: updated => {
          lead.estado_peticion = updated.estado_peticion;
          this.snackBar.open(`Lead #${lead.id_cliente} actualizado a '${updated.estado_peticion}'`, 'Cerrar', { duration: 3000 });
        },
        error: err => {
          console.error('Error al actualizar estado', err);
          this.snackBar.open('Error al actualizar estado', 'Cerrar', { duration: 3000 });
        }
      });
  }

}
