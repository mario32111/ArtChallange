import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-requeriments',
  imports: [ CommentsComponent, CommonModule],
  standalone: true,
  templateUrl: './post-requeriments.component.html',
  styleUrl: './post-requeriments.component.css'
})
export class PostRequerimentsComponent {
  showComments = false;

  toggleComments() {
    this.showComments= !this.showComments;
  }
}
