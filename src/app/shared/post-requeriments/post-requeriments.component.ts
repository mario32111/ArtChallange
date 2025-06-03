import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts.service';
import { OnInit } from '@angular/core';
import { ConvovatoriaPost } from '../../interfaces/post.interfaces';
import { ChallangeDocument } from '../../interfaces/challange.model';
import { ChallangeService } from '../../services/challange.service';
@Component({
  selector: 'app-post-requeriments',
  imports: [CommentsComponent, CommonModule],
  standalone: true,
  templateUrl: './post-requeriments.component.html',
  styleUrl: './post-requeriments.component.css'
})
export class PostRequerimentsComponent implements OnInit {

  showComments = false;
  post: ConvovatoriaPost[] = []; // Cambia 'any' por tu modelo de datos si lo tienes definido
  convocatoria: ChallangeDocument | any;
  constructor(private postsService: PostsService,
    private convocatoriaService: ChallangeService
  ) {
  }

  ngOnInit(): void {
    this.postsService.getAllPosts().subscribe(res => {
      const randomIndex = Math.floor(Math.random() * res.length);
      this.post = [res[randomIndex]];
      console.log("post", this.post);

      // Ahora que ya tenemos el post, consultamos el concursoRef
      const concursoRefId = this.post[0].concursoRef;
      this.convocatoriaService.getChallangeById(concursoRefId).subscribe(res => {
        console.log("consultando convocatoria por id");
        this.convocatoria = res;
        console.log("convocatoria asociada al post", this.convocatoria);
      });
    });
  }


  toggleComments() {
    this.showComments = !this.showComments;
  }
}
