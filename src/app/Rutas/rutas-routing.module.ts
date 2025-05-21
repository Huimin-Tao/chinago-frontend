import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaRutasComponent } from './components/vista-rutas/vista-rutas.component';


const routes: Routes = [
  { path: '', component: VistaRutasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutasRoutingModule { }
