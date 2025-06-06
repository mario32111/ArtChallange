
export interface Comentario {
  id?: string;
  usuarioId: string;
  postId: string;
  nombreUsuario: string;
  contenido: string;
  fecha: Date;
}


export interface Like {
  id?: string;
  usuarioId: string;
  nombreUsuario: string;
  postId: string; // ID del post al que se le dio like (si es necesario registrar esto en una colección separada)
  fecha: Date;    // Fecha en que se dio like
}

export interface ConvovatoriaPost {
  tipo: 'concurso'; // Podrías agregar más tipos si en el futuro agregas otro tipo de publicación

  concursoRef: string; // ID del documento de tipo ChallangeDocument (referencia)
  autorId: string;
  autorNombre: string;

  fechaPublicacion: Date;

  likes: Like[]; // IDs de usuarios que han dado like
  comentarios: Comentario[]; // Comentarios del usuario

  hashtags: string[]; // Solo si se usan para el feed, de lo contrario pueden omitirse
  etiquetas: string[]; // Handles

  creadoEn: Date;
  actualizadoEn: Date;
}
