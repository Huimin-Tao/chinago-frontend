import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BuscadorRutasComponent } from '../Rutas/components/buscador-rutas/buscador-rutas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { PrivacidadComponent } from './privacidad/privacidad.component';
import { CookiesComponent } from './cookies/cookies.component';
import { AvisoLegalComponent } from './aviso-legal/aviso-legal.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BuscadorRutasComponent,
    SobreNosotrosComponent,
    ContactoComponent,
    PrivacidadComponent,
    CookiesComponent,
    AvisoLegalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule

  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    BuscadorRutasComponent,
  ]
})
export class SharedModule { }