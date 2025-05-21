import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VistaGuiasComponent } from './vista-guias/vista-guias.component';
import { GuiaComponent } from './guia/guia.component';
import { GuiasRoutingModule } from './guias-routing.module';
import { SharedModule } from '../../Shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VistaGuiasComponent,
    GuiaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    GuiasRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class GuiasModule {}