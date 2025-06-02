import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-requeriments',
  imports: [ CommentsComponent, CommonModule],
  standalone: true,
  templateUrl: './post-requeriments.component.html',
  styleUrl: './post-requeriments.component.css'
})
export class PostRequerimentsComponent {
  showComments = false;

  constructor(private postsService: PostsService){
  }

  toggleComments() {
    this.showComments= !this.showComments;
  }
}
