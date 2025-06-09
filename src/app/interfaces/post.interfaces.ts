export interface CommentLike {
  id?: string; // ID del documento de like en Firestore
  usuarioId: string; // ID del usuario que dio like
  nombreUsuario: string; // Nombre del usuario que dio like
  commentId: string; // ID del comentario al que se le dio like
  fecha: Date; // Fecha en que se dio like
}

// Actualiza la interfaz Comentario para incluir likes
export interface Comentario {
  id?: string;
  usuarioId: string;
  postId: string;
  nombreUsuario: string;
  contenido: string;
  fecha: Date;
  likes?: CommentLike[]; // Añadimos un array para los likes de este comentario
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


export interface UserPost {
  id?: string; // <--- ADD THIS LINE to allow the 'id' property
  tipo: 'participacion'; // Distinct type for user submissions

  autorId: string;
  autorNombre: string;
  imagenUrl: string;
  descripcion: string; // 👈 Add this


  hashtags: string[];
  etiquetas: string[];

  likes: string[];
  comentarios: Comentario[];

  fechaPublicacion: Date;
  creadoEn: Date;
  actualizadoEn: Date;
  concursoId?: string; // <--- This line was already here (optional ID of the selected contest)

}
