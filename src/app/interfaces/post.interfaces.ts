// src/app/interfaces/post.interfaces.ts

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
  contenido: string; // Renombrado de 'texto' a 'contenido'
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
  tipo: 'concurso';
  concursoRef: string;
  autorId: string;
  autorNombre: string;
  fechaPublicacion: Date;
  likes: Like[]; // Array de objetos Like
  comentarios: Comentario[];
  hashtags: string[];
  etiquetas: string[];
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface UserPost {
  id?: string;
  tipo: 'participacion';
  autorId: string;
  autorNombre: string;
  imagenUrl: string;
  descripcion: string;
  hashtags: string[];
  etiquetas: string[];
  likes: Like[]; // <-- Changed from `string[]` to `Like[]` for consistency
  comentarios: Comentario[];
  fechaPublicacion: Date;
  creadoEn: Date;
  actualizadoEn: Date;
  concursoId?: string;
}
