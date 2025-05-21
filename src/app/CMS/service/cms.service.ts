import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lead } from '../models/lead.model';

@Injectable({ providedIn: 'root' })
export class CmsService {
  private api = `${environment.apiUrl}/api/clientes-potenciales`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.api);
  }

  updateStatus(id: number, estado_peticion: 'en proceso' | 'contactado'): Observable<Lead> {
    return this.http.put<Lead>(`${this.api}/${id}`, { estado_peticion });
  }


}