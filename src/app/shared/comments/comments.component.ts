import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  newCommentText: string = '';

  addComment() {
    if (this.newCommentText.trim()) {
      // Aquí puedes agregar lógica para guardar el comentario
      console.log('Nuevo comentario:', this.newCommentText);
      this.newCommentText = ''; // Limpia el campo
    }
  }
}
