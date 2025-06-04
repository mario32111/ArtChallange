export interface Concurso {
  id?: string;
  inscripcionCosto: string;
  startDate: string;
  endDate: string;
  premios: string;
  descripcion: string;
  nombre: string;
  organizador: string;
  categoria: string;
  imagen: string;
}

export interface ChallangeDocument {
  id?: string; // UID del documento, asignado por Firestore si no lo pones explícitamente
  nombre: string; // "Foto entre Amigos"
  slogan?: string; // Nuevo: Un encabezado corto o gancho, ej. "¡Llamando a todos los amantes de la fotografía y la amistad!"
  organizador: string; // "PhotoWorld"
  categoria: string; // "Fotografía urbana"
  inscripcionCosto: number; // 120
  startDate: Date; // Fecha de inicio de participación (en formato ISO string o Timestamp de Firebase)
  endDate: Date; // Fecha límite de participación (en formato ISO string o Timestamp de Firebase)
  announcementDate?: Date; // Nuevo: Fecha de anuncio de ganadores
  premios: string[]; // Nuevo: Un array de premios, ej. ["Publicación en revista", "$5,000 MXN", "Cámara DSLR"]
  descripcionCorta?: string; // Nuevo: Un resumen corto del concurso, ej. "¿Tienes una foto que capture la esencia de la amistad? ¡Este es tu momento!"
  descripcionLarga: string; // La descripción completa del concurso (el texto largo que tienes ahora)
  imagen: string; // La URL de la imagen de la convocatoria/banner
  hashtag: string; // Nuevo: "FotoEntreAmigos2024"
  etiquetasRedes: string[]; // Nuevo: Nombres de usuario o handles a etiquetar, ej. ["@PhotoWorldOficial", "@MiAppConcursos"]
  instruccionesParticipacion: string[]; // Nuevo: Pasos para participar, ej. ["Toma una foto...", "Súbela a Instagram...", "Etiquétanos..."]
  infoAdicionalLink?: string; // Nuevo: "Más info en [Inserta enlace]"
  estado: 'abierto' | 'cerrado' | 'proximo'; // Nuevo: Para gestionar el ciclo de vida del concurso
  createdAt: Date; // Nuevo: Timestamp de creación del documento
  updatedAt: Date; // Nuevo: Timestamp de última actualización
  // Otros campos que puedas necesitar, por ejemplo:
  // participantesCount?: number;
  // likesCount?: number;
}
