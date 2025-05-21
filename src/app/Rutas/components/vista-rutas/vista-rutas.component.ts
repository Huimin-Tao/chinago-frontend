import { Component, OnInit} from '@angular/core';
import { RutasService } from '../../services/rutas.service';
import { Ruta } from '../../models/ruta';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-vista-rutas',
  templateUrl: './vista-rutas.component.html',
  styleUrl: './vista-rutas.component.css'
})
export class VistaRutasComponent implements OnInit {
  // listado completo y paginado
  rutasCompleto: Ruta[] = [];
  rutasPaginadas: Ruta[] = [];

  // paginación
  paginaActual = 1;
  tamPagina = 8;
  totalRutas = 0;

  // estados
  filtroActual: string = '';
  filtroIds: number[] = [];
  cargando = false;
  error = '';
  apiurl = environment.apiUrl;

  constructor(private rutasService: RutasService) {}

  ngOnInit(): void {
    this.cargarRutas();
  }

  // getter para páginas numeradas
  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalRutas / this.tamPagina);
  }

  // onSearch(query: string): void {
  //   this.filtroActual = query;
  //   this.paginaActual = 1;
  //   this.actualizarPaginado();
  // }
  onSearch(payload: string | Ruta[]) {
    this.paginaActual = 1;
    if (typeof payload === 'string') {
      // Búsqueda por texto
      this.filtroActual = payload;
      this.filtroIds = [];
      this.paginaActual = 1;
      this.actualizarPaginado();
    } else {
      // Ya recibimos directamente el array filtrado

      this.filtroIds = payload.map(r => r.id_ruta);
      this.filtroActual = '';
      this.actualizarPaginado();
    }
  }

  onPageChange(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas) {
      return;
    }
    this.paginaActual = nuevaPagina;
    this.actualizarPaginado();
  }

  private cargarRutas(): void {
    this.cargando = true;
    this.rutasService.getRutas().subscribe({
      next: rutas => {
        this.rutasCompleto = rutas;
        this.totalRutas = rutas.length;
        this.actualizarPaginado();
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error cargando rutas';
        this.cargando = false;
      }
    });
  }

  private actualizarPaginado(): void {
    // opcional: filtrado por texto antes de paginar
    let filtradas = this.rutasCompleto;
    if (this.filtroActual) {
      const term = this.filtroActual.toLowerCase();
      filtradas = filtradas.filter(r =>
        r.titulo_ruta.toLowerCase().includes(term) ||
        (r.description_ruta?.toLowerCase().includes(term))
      );
    }
    if (this.filtroIds.length) {
      filtradas = filtradas.filter(r =>
        this.filtroIds.includes(r.id_ruta)
      );
    }

    this.totalRutas = filtradas.length;
    const start = (this.paginaActual - 1) * this.tamPagina;
    this.rutasPaginadas = filtradas.slice(start, start + this.tamPagina);
  }

}
