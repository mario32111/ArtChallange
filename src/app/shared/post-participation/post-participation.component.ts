import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-participation',
  imports: [CommentsComponent, CommonModule],
  standalone: true,
  templateUrl: './post-participation.component.html',
  styleUrl: './post-participation.component.css'
})
export class PostParticipationComponent {
  showComments = false;

  toggleComments() {
    this.showComments= !this.showComments;
  }
}
