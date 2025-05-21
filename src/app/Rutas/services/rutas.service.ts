import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Comentario, Filtro, Foto, Ruta, TipoFiltro } from '../models/ruta';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Auth/auth.service';



export interface GetRutasParams {
  /** Texto de búsqueda (opcional) */
  q?: string;
  /** Número de página (1‑based) */
  page?: number;
  /** Tamaño de página (opcional, por defecto 8) */
  pageSize?: number;
}

export interface GetRutasResponse {
  /** Lista de rutas para la página actual */
  items: Ruta[];
  /** Total de rutas disponibles */
  total: number;
}

export interface GetFiltrosRutas {
  /** Lista tipos filtros */
  tipofiltros: TipoFiltro[];
  /** Lista filtros */
  filtros: Filtro[];
}

export interface GetRutasFiltro {
  filtro: Filtro[];
  rutas: Ruta[];
}


@Injectable({
  providedIn: 'root'
})
export class RutasService {

  private baseUrl = environment.apiUrl;
  private authService: AuthService | undefined;

  constructor(private http: HttpClient) { }


  getRutas(): Observable<Ruta[]> {

    return this.http.get<Ruta[]>(this.baseUrl + "/api/rutas");
  }


  getRutasById(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(this.baseUrl + "/api/rutas/" + id);
  }


  getTiposFiltro(): Observable<TipoFiltro[]> {
    return this.http.get<TipoFiltro[]>(this.baseUrl + "/api/tipos-filtro");
  }
  getRutasPorFiltro(idFiltro: number): Observable<Ruta[]> {
    return this.http.get<Filtro>(this.baseUrl + "/api/filtro/" + idFiltro).pipe(map(response => response.rutas));

  }
  getComentarios(idRuta: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(
      `${this.baseUrl}/api/rutas/${idRuta}/comentarios`
    );
  }
  postComentario(idRuta: number, id_usuario: number, comentario: string, valoracion: number): Observable<Comentario> {
    const body = {
      id_usuario,
      comentario,
      valoracion
    };
    return this.http.post<Comentario>(
      this.baseUrl + "/api/rutas/" + idRuta + "/comentarios",
      body
    );
  }
  createRuta(payload: Ruta): Observable<Ruta> {
    return this.http.post<Ruta>(this.baseUrl + "/api/rutas/", payload);
  }
  updateRuta(id: number, payload: Ruta): Observable<Ruta> {
    return this.http.put<Ruta>(this.baseUrl + "/api/rutas/" + id, payload);
  }
  deleteRuta(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + "/api/rutas/" + id);
  }
  uploadFoto(id_ruta: number, file: File): Observable<Foto> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<Foto>(
      this.baseUrl + "/api/rutas/" + id_ruta + "/fotos",
      formData
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error subiendo imagen:', error.error);
        return throwError(() => error);
      })
    );
  }
  updateFotos(id_foto_guia: number, file: File): Observable<Foto> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService?.user?.token}`
    });

    return this.http.post<Foto>(
      `${this.baseUrl}/api/rutas/fotos/${id_foto_guia}`,
      formData,
      { headers }
    );
  }
  addFiltroRuta(id_ruta: number, id_filtro: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/filtros/rutas`, {
      id_filtro,
      id_ruta
    });
  }
  addItinerario(idRuta: number, itinerario: any) {
    return this.http.post(`${this.baseUrl}/api/rutas/${idRuta}/itinerarios`, itinerario);
  }
  deleteItinerario(id_itinerario: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/itinerarios/${id_itinerario}`);
  }
}
