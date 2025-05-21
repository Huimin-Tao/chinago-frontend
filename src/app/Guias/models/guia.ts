export interface Foto {
    id_foto: number;
    id_guia: number;
    url_foto: string;
  }

  export interface Guia {
    id_guia: number;
    titulo_guia: string;
    description_guia: string;
    fotos: Foto[];
  }

  export type GuiaForm = Omit<Guia, 'id_guia' | 'fotos'>;