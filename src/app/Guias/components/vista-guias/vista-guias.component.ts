import { Component, OnInit} from '@angular/core';
import { GuiasService } from '../../services/guias.service';
import { Guia } from '../../models/guia';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-vista-guias',
  templateUrl: './vista-guias.component.html',
  styleUrl: './vista-guias.component.css'
})
export class VistaGuiasComponent implements OnInit{

  guias: Guia[] = [];
  guiasPaginadas: Guia[] = [];
  paginaActual = 1;
  tamPagina = 4;
  totalGuias = 0;

  chatInput = '';
  chatResponse = '';
  loading = false;
  apiurl = environment.apiUrl;


  constructor(
    private guiasService: GuiasService,
  ) {}

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalGuias / this.tamPagina);
  }

  ngOnInit(): void {
    this.cargarGuias();
  }

  private cargarGuias(): void {
    this.guiasService.getGuias().subscribe({
      next: list => {
        this.guias = list;
        this.totalGuias = list.length;
        this.actualizarPaginado();
      },
      error: err => {
        console.error('Error cargando guías:', err);
      }
    });
  }


  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas) {
      return;
    }
    this.paginaActual = nuevaPagina;
    this.actualizarPaginado();
  }


  private actualizarPaginado(): void {
    const start = (this.paginaActual - 1) * this.tamPagina;
    this.guiasPaginadas = this.guias.slice(start, start + this.tamPagina);
  }

  sendQuestion(): void {
    const question = this.chatInput.trim();
    if (!question) {
      return;
    }

    this.loading = true;
    this.chatResponse = '';

    this.guiasService.askGemini(question).subscribe({
      next: answer => {
        this.chatResponse = answer;
        this.loading = false;
      },
      error: err => {
        console.error('Error en Gemini:', err);
        this.chatResponse = 'Lo siento, ha ocurrido un error al obtener la respuesta.';
        this.loading = false;
      }
    });
  }

}
