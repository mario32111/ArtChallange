// comments.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'; // Añadir OnChanges, SimpleChanges
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments.service'; // Ajusta la ruta según tu proyecto
import { Comentario } from '../../interfaces/post.interfaces'; // Ajusta la ruta según tu proyecto

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnChanges { // Implementar OnChanges
  @Input() postId!: string; // ID del post al que pertenecen los comentarios
  @Input() currentUserId!: string; // ID del usuario actual
  @Input() currentUserName!: string; // Nombre del usuario actual

  @Output() commentAdded = new EventEmitter<Comentario>(); // Evento que se emite al añadir un comentario

  newCommentText: string = '';
  comments: Comentario[] = []; // Array para almacenar los comentarios del post

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {
    // La carga inicial se moverá a ngOnChanges para asegurar que postId esté listo.
    // Esto es útil si postId se carga asíncronamente en el componente padre.
  }

  // ngOnChanges detecta cambios en las propiedades de entrada (@Input)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] && this.postId) {
      // Solo cargar los comentarios si el postId ha cambiado y tiene un valor válido
      this.loadComments();
    }
  }

  // Carga los comentarios para el post actual
  loadComments() {
    this.commentsService.getCommentsForPost(this.postId).subscribe(
      (comments) => {
        // Ordenar los comentarios por fecha, los más nuevos primero
        this.comments = comments.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
        console.log(`Comentarios cargados para postId ${this.postId}:`, this.comments); // Para depuración
      },
      (error) => {
        console.error('Error al cargar los comentarios:', error);
      }
    );
  }

  // Añade un nuevo comentario al post
  async addComment() {
    if (!this.newCommentText.trim()) {
      return; // No añadir comentarios vacíos
    }

    if (!this.currentUserId) {
      console.error('Para añadir un comentario, el usuario debe estar autenticado.');
      // Aquí podrías mostrar un mensaje al usuario (ej. un modal)
      return;
    }

    const newComment: Comentario = {
      usuarioId: this.currentUserId,
      postId: this.postId,
      nombreUsuario: this.currentUserName,
      contenido: this.newCommentText.trim(),
      fecha: new Date() // Fecha actual del comentario
    };

    try {
      const commentId = await this.commentsService.addCommentToPost(newComment);
      console.log('Comentario añadido con ID:', commentId);

      // Añadir el nuevo comentario al inicio del array local para que se vea inmediatamente
      // Aseguramos que tenga el ID asignado por Firestore
      this.comments.unshift({ ...newComment, id: commentId });

      // Emitir el evento para que el componente padre pueda actualizar el conteo
      this.commentAdded.emit(newComment);

      this.newCommentText = ''; // Limpiar el campo de texto
    } catch (error) {
      console.error('Error al añadir el comentario:', error);
      // Manejar el error, mostrar un mensaje al usuario
    }
  }

  // Función auxiliar para formatear la fecha de un comentario
  formatCommentDate(date: Date): string {
    const now = new Date();
    const commentDate = new Date(date); // Asegúrate de que es un objeto Date

    const diffMs = now.getTime() - commentDate.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'hace un momento';
    if (diffMinutes < 60) return `hace ${diffMinutes} min`;
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

    // Si es más de una semana, formatear con fecha completa
    return commentDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
