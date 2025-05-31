import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-requeriments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-requeriments.component.html',
  styleUrls: ['./post-requeriments.component.css']
})
export class PostRequerimentsComponent {
  showComments = false;

  toggleComments() {
    this.showComments= !this.showComments;
  }
}
