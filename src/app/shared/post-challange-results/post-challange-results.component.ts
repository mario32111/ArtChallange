import { Component } from '@angular/core';
import { CorrouselResultsComponent } from '../corrousel-results/corrousel-results.component';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-challange-results',
  standalone: true,
  imports: [CorrouselResultsComponent, CommentsComponent, CommonModule],
  templateUrl: './post-challange-results.component.html',
  styleUrl: './post-challange-results.component.css'
})
export class PostChallangeResultsComponent {
  showComments = false;

  toggleComments() {
    this.showComments= !this.showComments;
  }
}
