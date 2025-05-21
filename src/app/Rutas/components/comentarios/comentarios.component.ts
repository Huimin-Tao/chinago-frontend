import { Component, Input, OnInit } from '@angular/core';
import { Comentario } from '../../models/ruta';
import { AuthService } from '../../../Auth/auth.service';
import { RutasService } from '../../services/rutas.service';
import { User } from '../../../Auth/user';
@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent implements OnInit{

  @Input() rutaId!: number;

  comentarios: Comentario[] = [];
  isAuthenticated = false;
  currentUser: User | null = null;
  newRating = 0;
  newCommentText = '';

  constructor(
    private auth: AuthService,
    private rutasService: RutasService
  ) {}


  ngOnInit(): void {
    this.isAuthenticated = this.auth.isLoggedIn;
    if (this.isAuthenticated) {
      this.currentUser = this.auth.user;

    }
    this.loadComentarios();
  }

  private loadComentarios() {
    if (!this.rutaId) return;
    this.rutasService.getComentarios(this.rutaId).subscribe({
      next: comments => {
        this.comentarios = comments;
      },
      error: err => console.error('Error cargando comentarios', err)
    });
  }

  getStarsForComentario(c: Comentario): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < c.valoracion ? 'fa-star' : 'fa-star-o'
    );
  }

  submitComment() {

    if (!this.newCommentText.trim() || this.newRating === 0) {
      return;
    }
    const userId = this.currentUser?.usuario.id_usuario!;
    this.rutasService
      .postComentario(this.rutaId, userId ,this.newCommentText, this.newRating)
      .subscribe({
        next: (saved: Comentario) => {
          // Añado a la lista local para refrescar la vista
          this.comentarios.push(saved);
          // Limpio el formulario
          this.newCommentText = '';
          this.newRating = 0;
          this.loadComentarios();
        },
        error: err => {
          console.error('Error guardando comentario', err);
        }
      });
  }

}
