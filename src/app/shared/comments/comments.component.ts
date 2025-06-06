// comments.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { Comentario, CommentLike } from '../../interfaces/post.interfaces'; // Importar Comentario y CommentLike

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() postId!: string;
  @Input() currentUserId!: string;
  @Input() currentUserName!: string;

  @Output() commentAdded = new EventEmitter<Comentario>();

  newCommentText: string = '';
  comments: Comentario[] = [];

  // Inyectar CommentLikesService
  constructor(
    private commentsService: CommentsService,
  ) { }

  ngOnInit(): void {
    // La carga inicial se moverá a ngOnChanges para asegurar que postId esté listo.
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] && this.postId) {
      console.log(`CommentsComponent: postId cambió a ${this.postId}. Cargando comentarios...`);
      this.loadComments();
    }
  }

  loadComments() {
    this.commentsService.getCommentsForPost(this.postId).subscribe(
      async (comments) => { // Marca como async para usar await
        // Para cada comentario, cargar sus likes
        for (const comment of comments) {
          if (comment.id) { // Asegúrate de que el comentario tiene un ID
            comment.likes = await this.commentsService.getLikesForComment(comment.id);
          } else {
            comment.likes = []; // Si no hay ID, no hay likes asociados
          }
        }

        // Ordenar los comentarios por fecha, los más nuevos primero
        this.comments = comments.sort((a, b) => {
          const dateA = a.fecha instanceof Date ? a.fecha.getTime() : (new Date(a.fecha)).getTime();
          const dateB = b.fecha instanceof Date ? b.fecha.getTime() : (new Date(b.fecha)).getTime();

          if (isNaN(dateA) || isNaN(dateB)) {
            console.warn('Fecha inválida encontrada en comentario durante la ordenación.', a, b);
            return 0;
          }
          return dateB - dateA;
        });
        console.log(`Comentarios cargados y ordenados para postId ${this.postId}:`, this.comments);
      },
      (error) => {
        console.error('Error al cargar los comentarios:', error);
        this.comments = [];
      }
    );
  }

  async addComment() {
    if (!this.newCommentText.trim()) {
      return;
    }

    if (!this.currentUserId) {
      console.error('Para añadir un comentario, el usuario debe estar autenticado.');
      return;
    }

    const newComment: Comentario = {
      usuarioId: this.currentUserId,
      postId: this.postId,
      nombreUsuario: this.currentUserName,
      contenido: this.newCommentText.trim(),
      fecha: new Date(),
      likes: [] // Inicializa el array de likes para el nuevo comentario
    };

    try {
      const commentId = await this.commentsService.addCommentToPost(newComment);
      console.log('Comentario añadido con ID:', commentId);

      // Aseguramos que tenga el ID asignado por Firestore y el array de likes
      this.comments.unshift({ ...newComment, id: commentId, likes: [] });

      this.commentAdded.emit(newComment);
      this.newCommentText = '';
    } catch (error) {
      console.error('Error al añadir el comentario:', error);
    }
  }

  /**
   * Alterna el like de un comentario.
   * @param comment El comentario al que se le dará o quitará el like.
   */
  async toggleCommentLike(comment: Comentario) {
    if (!this.currentUserId || !comment.id) {
      console.error('Usuario no autenticado o ID de comentario no disponible para dar like.');
      return;
    }

    const likeData = {
      usuarioId: this.currentUserId,
      commentId: comment.id,
      nombreUsuario: this.currentUserName
    };

    try {
      const result = await this.commentsService.toggleCommentLike(likeData);
      console.log(`Resultado del like en comentario ${comment.id}:`, result);

      if (result === 'liked') {
        const newLike: CommentLike = {
          usuarioId: this.currentUserId,
          commentId: comment.id,
          nombreUsuario: this.currentUserName,
          fecha: new Date()
        };
        if (!comment.likes) {
          comment.likes = [];
        }
        comment.likes.push(newLike);
      } else {
        if (comment.likes) {
          comment.likes = comment.likes.filter(like => like.usuarioId !== this.currentUserId);
        }
      }
    } catch (error) {
      console.error('Error al alternar el like del comentario:', error);
    }
  }

  /**
   * Verifica si el usuario actual ha dado like a un comentario.
   * @param comment El comentario a verificar.
   * @returns true si el usuario actual dio like, false en caso contrario.
   */
  hasUserLikedComment(comment: Comentario): boolean {
    if (!this.currentUserId || !comment.likes) {
      return false;
    }
    return comment.likes.some(like => like.usuarioId === this.currentUserId);
  }


  formatCommentDate(date: Date): string {
    const now = new Date();
    const commentDate = new Date(date);

    const diffMs = now.getTime() - commentDate.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'hace un momento';
    if (diffMinutes < 60) return `hace ${diffMinutes} min`;
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

    return commentDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
