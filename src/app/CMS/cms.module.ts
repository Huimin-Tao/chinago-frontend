import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionClientesComponent } from './component/gestion-clientes/gestion-clientes.component';
import { GestionRutasComponent } from './component/gestion-rutas/gestion-rutas.component';
import { GestionGuiasComponent } from './component/gestion-guias/gestion-guias.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../Shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    GestionClientesComponent,
    GestionRutasComponent,
    GestionGuiasComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule
  ]
})
export class CMSModule { }
