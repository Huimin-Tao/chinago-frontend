import { Component, Input} from '@angular/core';
import { Ruta } from '../../models/ruta';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ruta-card',
  templateUrl: './ruta-card.component.html',
  styleUrl: './ruta-card.component.css'
})
export class RutaCardComponent {
  @Input() ruta!: Ruta;
  apiurl = environment.apiUrl;

  getFiltroPorDescription(description: string): string {
    const f = this.ruta.filtros.find(f =>
      f.tipo_filtro.description_filtro.toLowerCase() === description.toLowerCase()
    );
    return f ? f.contenido_filtro : '';
  }
}
