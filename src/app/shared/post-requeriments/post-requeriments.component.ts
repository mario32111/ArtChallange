import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts.service';
import { OnInit } from '@angular/core';
import { ConvovatoriaPost } from '../../interfaces/post.interfaces';
import { ChallangeDocument } from '../../interfaces/challange.model';
import { ChallangeService } from '../../services/challange.service';
import { LikesService } from '../../services/likes.service';
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
  //documento postChallange
  post: ConvovatoriaPost[] = [];
  //documento challange
  convocatoria: ChallangeDocument | any;
  constructor(private postsService: PostsService,
    private convocatoriaService: ChallangeService,
    private likesService: LikesService

  ) {
  }

  async ngOnInit() {
    this.postsService.getAllPosts().subscribe(async (res) => {
      const randomIndex = Math.floor(Math.random() * res.length);
      this.post = [res[randomIndex]];

      const concursoRefId = this.post[0].concursoRef;
      this.convocatoriaService.getChallangeById(concursoRefId).subscribe(res => {
        this.convocatoria = res;
      });

      // Obtener likes con nombreUsuario
      const likes = await this.likesService.getLikesForPost(this.post[0].concursoRef);
      this.post[0].likes = likes; // ahora sí con nombreUsuario
    });
  }




  userData = getParsedLocalStorageItem<AuthResponse>('user');
  currentUserName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';
  currentUserId = this.userData?.user.uid;

  async toggleLike(post: ConvovatoriaPost) {
    const auth = getParsedLocalStorageItem<AuthResponse>('auth');
    if (!this.currentUserId) {
      console.error('Usuario no autenticado correctamente');
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

    // Actualiza el estado local
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


  // Devuelve si el usuario actual ya dio like al post
  hasUserLiked(post: ConvovatoriaPost): boolean {
    return post.likes.some(like => like.usuarioId === this.currentUserId);
  }

  // Devuelve una cadena con los nombres de los primeros 2 usuarios que dieron like
  get firstTwoLikeUsers(): string {
    if (!this.post.length) return '';
    return this.post[0].likes.slice(0, 2).map(like => like.nombreUsuario).join(', ');
  }


}
