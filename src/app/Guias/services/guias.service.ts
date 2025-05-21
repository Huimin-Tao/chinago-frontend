import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Foto, Guia, GuiaForm } from '../models/guia';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Auth/auth.service';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
  }>;
}

@Injectable({ providedIn: 'root' })
export class GuiasService {
  private apiUrl = environment.apiUrl + "/api/guias";
  private geminiUrl = environment.geminiApiUrl;
  private geminiModel = environment.geminiModel;
  private geminiKey = environment.geminiApiKey;
  private authService: AuthService | undefined;

  constructor(private http: HttpClient) {}


  getGuias(): Observable<Guia[]> {
    return this.http.get<Guia[]>(this.apiUrl);
  }


  getGuiaById(id: number): Observable<Guia> {
    return this.http.get<Guia>(`${this.apiUrl}/${id}`);
  }
  createGuia(payload: GuiaForm): Observable<Guia> {
    return this.http.post<Guia>(this.apiUrl, payload);
  }


  createFotoGuia(id_guia: number, file: File): Observable<Foto> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<Foto>(`${this.apiUrl}/${id_guia}/fotos`, fd);
  }

  createGuiaConFoto(
    guiaPayload: GuiaForm,
    file: File
  ): Observable<{ guia: GuiaForm; foto: Foto }> {
    return this.createGuia(guiaPayload).pipe(
      switchMap(guia =>
        this.uploadFoto(guia.id_guia, file).pipe(
          map(foto => ({
            guia: { ...guia, fotos: [foto] },
            foto
          }))
        )
      )
    );
  }
  updateGuia(id: number, payload: Guia): Observable<Guia> {
    return this.http.put<Guia>(`${this.apiUrl}/${id}`, payload);
  }
  deleteGuia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  askGemini(question: string): Observable<string> {
    const url  = this.geminiUrl + this.geminiModel + this.geminiKey;
    const body = { contents: [
      {
        parts: [
          {
            text: "ahora eres un experto consultor de viajes a china, sabes todo  de china y eres el mejor, dame la mejor respuesta sobre: " + question
          }
        ]
      }
    ]
  };

    return this.http
    .post<GeminiResponse>(url, body)
      .pipe(
        map(resp => {

          const candidate = resp.candidates?.[0];
          const part      = candidate?.content.parts?.[0];
          const rawText   = part?.text ?? 'No se obtuvo respuesta.';

          return rawText.replace(/\s+$/, '');
        })
      );

  }


  uploadFoto(id_guia: number, file: File): Observable<Foto> {
    const formData = new FormData();
    formData.append('file', file, file.name);


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService?.user?.token}`
    });

    return this.http.post<Foto>(
      `${this.apiUrl}/${id_guia}/fotos`,
      formData
    );
  }

  updateFotos(id_foto_guia: number, file: File): Observable<Foto>{
    const formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append('file', file, file.name);

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService?.user?.token}`
  });

  return this.http.post<Foto>(
    `${this.apiUrl}/fotos/${id_foto_guia}`,
    formData,
    { headers }
  );
  }

}