// post-requeriments.component.ts (no necesita cambios adicionales, solo se muestra por contexto)
import { Component, OnInit } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts.service';
import { ConvovatoriaPost, Comentario } from '../../interfaces/post.interfaces';
import { ChallangeDocument } from '../../interfaces/challange.model';
import { ChallangeService } from '../../services/challange.service';
import { LikesService } from '../../services/likes.service';
import { CommentsService } from '../../services/comments.service';
import { AuthResponse } from '../../interfaces/auth.interface';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';

@Component({
  selector: 'app-post-requeriments',
  imports: [CommentsComponent, CommonModule],
  standalone: true,
  templateUrl: './post-requeriments.component.html',
  styleUrl: './post-requeriments.component.css'
})
export class PostRequerimentsComponent implements OnInit {

  showComments = false;
  post: ConvovatoriaPost[] = [];
  convocatoria: ChallangeDocument | any;

  userData = getParsedLocalStorageItem<AuthResponse>('user');
  currentUserName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';
  currentUserId = this.userData?.user.uid;

  constructor(
    private postsService: PostsService,
    private convocatoriaService: ChallangeService,
    private likesService: LikesService,
    private commentsService: CommentsService
  ) { }

  async ngOnInit() {
    this.postsService.getAllPosts().subscribe(async (res) => {
      if (res && res.length > 0) {
        const randomIndex = Math.floor(Math.random() * res.length);
        this.post = [res[randomIndex]];

        const concursoRefId = this.post[0].concursoRef;
        if (concursoRefId) {
          this.convocatoriaService.getChallangeById(concursoRefId).subscribe(res => {
            this.convocatoria = res;
          });

          const likes = await this.likesService.getLikesForPost(concursoRefId);
          this.post[0].likes = likes;

          if (!this.post[0].comentarios) {
              this.post[0].comentarios = [];
          }
        } else {
            console.warn('El post no tiene un concursoRef válido.');
        }
      } else {
        console.warn('No se encontraron posts.');
      }
    });
  }

  async toggleLike(post: ConvovatoriaPost) {
    if (!this.currentUserId) {
      console.error('Usuario no autenticado correctamente para dar like.');
      return;
    }
    const likeData = {
      usuarioId: this.currentUserId,
      nombreUsuario: this.currentUserName,
      postId: post.concursoRef,
      fecha: new Date()
    };

    const result = await this.likesService.toggleLike(likeData);
    console.log('Resultado del like:', result);

    if (result === 'liked') {
      post.likes.push({
        usuarioId: this.currentUserId,
        nombreUsuario: this.currentUserName,
        postId: post.concursoRef,
        fecha: new Date()
      });
    } else {
      post.likes = post.likes.filter(like => like.usuarioId !== this.currentUserId);
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  onCommentAdded(newComment: Comentario) {
    if (!this.post[0].comentarios) {
      this.post[0].comentarios = [];
    }
    this.post[0].comentarios.unshift(newComment);
    console.log('Comentario añadido localmente al post para actualizar el conteo:', newComment);
  }

  hasUserLiked(post: ConvovatoriaPost): boolean {
    return post.likes.some(like => like.usuarioId === this.currentUserId);
  }

  get firstTwoLikeUsers(): string {
    if (!this.post.length || !this.post[0].likes || this.post[0].likes.length === 0) return '';
    const twoUsers = this.post[0].likes.slice(0, 2).map(like => like.nombreUsuario).join(', ');
    if (this.post[0].likes.length > 2) {
      return `${twoUsers} y ${this.post[0].likes.length - 2} más`;
    }
    return twoUsers;
  }
}
