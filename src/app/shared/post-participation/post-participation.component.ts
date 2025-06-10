// src/app/components/post-participation/post-participation.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserPost, Like, Comentario } from '../../interfaces/post.interfaces'; // Importa Like y Comentario
import { ChallangeService } from '../../services/challange.service';
import { ChallangeDocument } from '../../interfaces/challange.model';
import { CommentsComponent } from '../comments/comments.component';
import { Router } from '@angular/router';
import { LikesService } from '../../services/likes.service'; // Importa LikesService
import { CommentsService } from '../../services/comments.service'; // Importa CommentsService
import { AuthResponse } from '../../interfaces/auth.interface'; // Importa AuthResponse
import { getParsedLocalStorageItem } from '../../../utils/storage.utils'; // Importa la utilidad

@Component({
  selector: 'app-post-participation',
  standalone: true,
  imports: [CommonModule, DatePipe, CommentsComponent],
  templateUrl: './post-participation.component.html',
  styleUrl: './post-participation.component.css'
})
export class PostParticipationComponent implements OnInit {
  @Input() post!: UserPost;
  showComments: boolean = false;
  contestName: string | undefined;
  contestIdForNavigation: string | undefined;

  // --- DATOS DEL USUARIO AUTENTICADO ---
  userData = getParsedLocalStorageItem<AuthResponse>('user');
  currentUserName: string = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';
  currentUserId: string | undefined = this.userData?.user.uid;
  // --- FIN DATOS DEL USUARIO ---

  constructor(
    private challangeService: ChallangeService,
    private router: Router,
    private likesService: LikesService, // Inyecta LikesService
    private commentsService: CommentsService // Inyecta CommentsService
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.post.concursoId) {
      this.contestIdForNavigation = this.post.concursoId;
      this.challangeService.getChallangeById(this.post.concursoId).subscribe({
        next: (concurso: ChallangeDocument) => {
          this.contestName = concurso.nombre;
        },
        error: (err) => {
          console.error(`Error fetching contest for post ${this.post.id}:`, err);
          this.contestName = 'Concurso Desconocido';
        }
      });
    }

    // --- CARGAR LIKES Y COMENTARIOS PARA ESTE POST DE PARTICIPACIÓN ---
    if (this.post.id) {
        try {
            // Aseguramos que el array de likes existe antes de cargarlos
            if (!this.post.likes) {
                this.post.likes = [];
            }
            const likes = await this.likesService.getLikesForPost(this.post.id);
            this.post.likes = likes; // Asigna los likes obtenidos

            // Aseguramos que el array de comentarios existe antes de cargarlos
            if (!this.post.comentarios) {
                this.post.comentarios = [];
            }
            const comentariosObservable = this.commentsService.getCommentsForPost(this.post.id);
            comentariosObservable.subscribe({
                next: (comentarios: Comentario[]) => {
                    this.post.comentarios = comentarios;
                },
                error: (error) => {
                    console.error('Error al cargar comentarios del post:', error);
                    this.post.comentarios = [];
                }
            });

        } catch (error) {
            console.error('Error al cargar likes o comentarios del post:', error);
            this.post.likes = []; // Asegura un array vacío en caso de error
            this.post.comentarios = []; // Asegura un array vacío en caso de error
        }
    } else {
        console.warn('El post de participación no tiene un ID válido para cargar likes/comentarios.');
        this.post.likes = [];
        this.post.comentarios = [];
    }
    // --- FIN CARGA DE LIKES Y COMENTARIOS ---
  }

  // --- MÉTODOS DE LIKES ---
  async toggleLike(post: UserPost) {
    if (!this.currentUserId) {
      console.error('Usuario no autenticado correctamente para dar like.');
      return;
    }

    const likeData: Like = {
      usuarioId: this.currentUserId,
      nombreUsuario: this.currentUserName,
      postId: post.id!, // Usamos `post.id!` ya que sabemos que existe en este contexto
      fecha: new Date()
    };

    const result = await this.likesService.toggleLike2(likeData);
    console.log('Resultado del like:', result);

    if (result === 'liked') {
      post.likes.push(likeData); // Añade el objeto `Like` completo
    } else {
      post.likes = post.likes.filter(like => like.usuarioId !== this.currentUserId);
    }
  }

  hasUserLiked(post: UserPost): boolean {
    return post.likes && post.likes.some(like => like.usuarioId === this.currentUserId);
  }

  get firstTwoLikeUsers(): string {
    if (!this.post || !this.post.likes || this.post.likes.length === 0) return '';
    const twoUsers = this.post.likes.slice(0, 2).map(like => like.nombreUsuario).join(', ');
    if (this.post.likes.length > 2) {
      return `${twoUsers} y ${this.post.likes.length - 2} más`;
    }
    return twoUsers;
  }
  // --- FIN MÉTODOS DE LIKES ---

  // --- MÉTODOS DE COMENTARIOS ---
  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  onCommentAdded(newComment: Comentario) {
    if (!this.post.comentarios) {
      this.post.comentarios = [];
    }
    this.post.comentarios.unshift(newComment);
    console.log('Comentario añadido localmente al post para actualizar el conteo:', newComment);
  }
  // --- FIN MÉTODOS DE COMENTARIOS ---

  goToContestDetails(): void {
    if (this.contestIdForNavigation) {
      this.router.navigate(['/challangeDetails', this.contestIdForNavigation]);
    } else {
      console.warn('Cannot navigate: Contest ID is not available.');
    }
  }
}
