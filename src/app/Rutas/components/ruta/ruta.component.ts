import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RutasService } from '../../services/rutas.service';
import { Comentario, Ruta, Itinerario, Filtro } from '../../models/ruta';
import { switchMap, map } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { environment } from '../../../../environments/environment';

// Configuración de las rutas de los iconos de Leaflet
import { Icon } from 'leaflet';

// Eliminar cualquier configuración previa de ruta de iconos
delete (Icon.Default.prototype as any)._getIconUrl;

// Asignar rutas correctas a los iconos en assets
Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.css']
})
export class RutaComponent implements OnInit {
  ruta!: Ruta;
  apiurl = environment.apiUrl;

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: L.Map;
  private currentMarker?: L.Marker;
  private readonly BEIJING: L.LatLngExpression = [39.9042, 116.4074];
  private readonly ZOOM = 10;

  leftItinerarios: Itinerario[] = [];
  rightItinerarios: Itinerario[] = [];

  stars: string[] = [];

  searchQuery: string = '';

  similarRutas: Ruta[] = [];

  constructor(
    private route: ActivatedRoute,
    private rutasService: RutasService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => +params.get('id')!),
        switchMap(id => this.rutasService.getRutasById(id))
      )
      .subscribe({
        next: data => {
          this.ruta = data;
          this.stars = this.getStars(data.comentarios);

          this.cd.detectChanges();

          this.initMap();
          const ciudadInicial = this.ruta.ciudades_ruta?.trim() || 'Beijing';
          this.setMarker(ciudadInicial);

          this.splitItinerarios();
          this.loadSimilarRutas();
        },
        error: err => console.error('Error cargando ruta', err)
      });
  }

  private initMap(): void {
    if (this.map) return;
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.BEIJING,
      zoom: this.ZOOM
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.currentMarker = L.marker(this.BEIJING).addTo(this.map);

    setTimeout(() => this.map.invalidateSize(), 0);
  }

  private setMarker(city: string): void {
    const q = encodeURIComponent(city);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}`;
    this.http.get<any[]>(url).subscribe(
      res => {
        if (!res.length) {
          console.warn('No encontrado', city);
          return;
        }
        const { lat, lon } = res[0];
        const coords: L.LatLngExpression = [+lat, +lon];
        this.map.setView(coords, this.ZOOM);
        if (this.currentMarker) {
          this.currentMarker.setLatLng(coords);
        } else {
          this.currentMarker = L.marker(coords).addTo(this.map);
        }
      },
      err => console.error('Error buscando ciudad', err)
    );
  }

  buscarCiudad(): void {
    const city = this.searchQuery.trim();
    if (city) {
      this.setMarker(city);
    }
  }

  private getStars(comments: Comentario[]): string[] {
    const avg = this.calculateAvgRating(comments);
    return Array.from({ length: 5 }, (_, i) => (i < avg ? 'fa-star' : 'fa-star-o'));
  }

  private calculateAvgRating(comments: Comentario[]): number {
    if (!comments || comments.length === 0) {
      return 0;
    }
    const sum = comments.reduce((acc, c) => acc + c.valoracion, 0);
    return Math.round(sum / comments.length);
  }

  private splitItinerarios(): void {
    const list = this.ruta.itinerarios.sort((a, b) => a.num_dia - b.num_dia);
    const half = Math.ceil(list.length / 2);
    this.leftItinerarios = list.slice(0, half);
    this.rightItinerarios = list.slice(half);
  }

  private loadSimilarRutas(): void {
    this.rutasService.getRutas().subscribe(
      allRutas => {
        const priorities = [1, 2, 3];
        const filtros: Filtro[] = priorities
          .map(pt => this.ruta.filtros.find(f => f.tipo_filtro.id_tipo === pt)!)
          .filter((f): f is Filtro => !!f);

        if (!filtros.length) {
          this.similarRutas = [];
          return;
        }

        const calls = filtros.map(f =>
          this.rutasService.getRutasPorFiltro(f.id_filtro).pipe(
            rxMap(rutasFiltradas => rutasFiltradas.map(r => r.id_ruta))
          )
        );

        forkJoin(calls).subscribe((arraysOfIds: number[][]) => {
          const result: Ruta[] = [];
          for (const idList of arraysOfIds) {
            for (const id of idList) {
              if (
                id !== this.ruta.id_ruta &&
                !result.some(r => r.id_ruta === id) &&
                result.length < 4
              ) {
                const match = allRutas.find(r => r.id_ruta === id);
                if (match) {
                  result.push(match);
                }
              }
            }
            if (result.length === 4) break;
          }
          this.similarRutas = result;
        });
      },
      err => console.error('Error cargando rutas similares', err)
    );
  }
}
