export interface Lead {
    id_cliente: number;
    nombre_cliente:string;
    apellido_cliente:string;
    email_cliente:string;
    telefono_cliente:string;
    presupuesto:string;
    ciudad:string;
    num_grupo:string;
    hotel:string;
    comentario_cliente:string;
    estado_peticion: 'en proceso' | 'contactado';
}