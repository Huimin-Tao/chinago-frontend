import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FormularioService {
  private API = environment.apiUrl + '/api/clientes-potenciales';
  constructor(private http: HttpClient) {}

  send(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }
}
