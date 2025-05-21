import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RutasRoutingModule } from './rutas-routing.module';

import { RutaCardComponent } from './components/ruta-card/ruta-card.component';
import { VistaRutasComponent } from './components/vista-rutas/vista-rutas.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../Shared/shared.module';
import { RutaComponent } from './components/ruta/ruta.component';
import { FormsModule } from '@angular/forms';
import { ComentariosComponent } from './components/comentarios/comentarios.component';


@NgModule({
  declarations: [
    RutaCardComponent,
    VistaRutasComponent,
    RutaComponent,
    ComentariosComponent
  ],
  imports: [
    CommonModule,
    RutasRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule,
    FormsModule
  ],
  exports:[
    VistaRutasComponent
  ]
})
export class RutasModule { }
