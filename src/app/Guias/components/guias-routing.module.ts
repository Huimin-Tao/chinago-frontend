import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaGuiasComponent } from './vista-guias/vista-guias.component';
import { GuiaComponent } from './guia/guia.component';

const routes: Routes = [
  { path: '', component: VistaGuiasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuiasRoutingModule {}