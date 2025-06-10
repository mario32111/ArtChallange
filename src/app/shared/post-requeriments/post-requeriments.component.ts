import { Component, Input, OnInit } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts.service'; // Still needed if you might fetch other posts later
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
  // The @Input() 'post' will now be the primary source of data for this component
  @Input() post!: ConvovatoriaPost; // Changed to single post, as it's for one post now

  showComments = false;
  // This 'convocatoria' will be specific to the @Input() post
  convocatoria: ChallangeDocument | any;

  userData = getParsedLocalStorageItem<AuthResponse>('user');
  currentUserName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';
  currentUserId = this.userData?.user.uid;

  constructor(
    // PostsService might not be directly used here anymore for fetching,
    // but keep it if other methods within the component might need it.
    private postsService: PostsService,
    private convocatoriaService: ChallangeService,
    private likesService: LikesService,
    private commentsService: CommentsService
  ) { }

  async ngOnInit() {
    // Check if the input 'post' is provided and valid
    if (this.post) {
      const concursoRefId = this.post.concursoRef; // Access directly from this.post

      if (concursoRefId) {
        // Fetch the challenge (convocatoria) associated with this specific post
        this.convocatoriaService.getChallangeById(concursoRefId).subscribe(res => {
          this.convocatoria = res;
        });

        // Fetch likes for this specific post
        const likes = await this.likesService.getLikesForPost(concursoRefId);
        this.post.likes = likes;

        // Ensure comments array exists
        if (!this.post.comentarios) {
          this.post.comentarios = [];
        }
      } else {
        console.warn('El post de entrada no tiene un concursoRef válido.');
      }
    } else {
      console.warn('El componente PostRequerimentsComponent fue cargado sin un post de entrada.');
      // You might want to handle this case, e.g., display a "no data" message
    }
  }

  async toggleLike(postToLike: ConvovatoriaPost) { // Renamed parameter for clarity
    if (!this.currentUserId) {
      console.error('Usuario no autenticado correctamente para dar like.');
      return;
    }
    const likeData = {
      usuarioId: this.currentUserId,
      nombreUsuario: this.currentUserName,
      postId: postToLike.concursoRef, // Use the postToLike parameter
      fecha: new Date()
    };

    const result = await this.likesService.toggleLike(likeData);
    console.log('Resultado del like:', result);

    if (result === 'liked') {
      postToLike.likes.push({ // Update the specific post's likes
        usuarioId: this.currentUserId,
        nombreUsuario: this.currentUserName,
        postId: postToLike.concursoRef,
        fecha: new Date()
      });
    } else {
      postToLike.likes = postToLike.likes.filter(like => like.usuarioId !== this.currentUserId); // Update the specific post's likes
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  onCommentAdded(newComment: Comentario) {
    // Make sure to add the comment to THIS component's 'post' object
    if (!this.post.comentarios) {
      this.post.comentarios = [];
    }
    this.post.comentarios.unshift(newComment);
    console.log('Comentario añadido localmente al post para actualizar el conteo:', newComment);
  }

  hasUserLiked(postToCheck: ConvovatoriaPost): boolean { // Renamed parameter for clarity
    return postToCheck.likes.some(like => like.usuarioId === this.currentUserId);
  }

  // This getter now directly accesses 'this.post.likes'
  get firstTwoLikeUsers(): string {
    if (!this.post || !this.post.likes || this.post.likes.length === 0) return '';
    const twoUsers = this.post.likes.slice(0, 2).map(like => like.nombreUsuario).join(', ');
    if (this.post.likes.length > 2) {
      return `${twoUsers} y ${this.post.likes.length - 2} más`;
    }
    return twoUsers;
  }
}