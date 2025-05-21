

export interface Foto {
  id_foto: number;
  id_ruta: number;
  url_foto: string;
}

export interface Itinerario {
  id_itinerario: number;
  id_ruta: number;
  url_icono: string;
  num_dia: number;
  resumen_itinerario: string;
}

export interface Comentario {
  id_comentario: number;
  id_usuario: number;
  id_ruta: number;
  comentario: string;
  valoracion: number;
  usuario: UserComentario;
}

export interface TipoFiltro {
  id_tipo: number;
  description_filtro: string;
  filtros: Filtro[];
}

export interface Filtro {
  id_filtro: number;
  id_tipo: number;
  contenido_filtro: string;
  tipo_filtro: TipoFiltro;
  rutas: Ruta[];

}

export interface Ruta {
  id_ruta: number;
  titulo_ruta: string;
  description_ruta: string;
  presupuesto_ruta: number;
  ciudades_ruta: string;
  duracion_ruta: number;
  itinerario_ruta: string;
  tematica_ruta: string;
  fotos: Foto[];
  itinerarios: Itinerario[];
  comentarios: Comentario[];
  filtros: Filtro[];
}

export interface UserComentario{
  id_usuario: number;
  name_user: string;
  lastname_user: string;
  email_user: string;
}