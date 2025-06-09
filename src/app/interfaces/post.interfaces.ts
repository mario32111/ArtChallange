export interface Comentario {
  id?: string;
  usuarioId: string;
  nombreUsuario: string;
  contenido: string;
  fecha: Date;
}

export interface ConvovatoriaPost {
  tipo: 'concurso'; // Podrías agregar más tipos si en el futuro agregas otro tipo de publicación

  concursoRef: string; // ID del documento de tipo ChallangeDocument (referencia)
  autorId: string;
  autorNombre: string;

  fechaPublicacion: Date;

  likes: string[]; // IDs de usuarios que han dado like
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