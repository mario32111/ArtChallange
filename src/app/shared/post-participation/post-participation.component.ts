import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserPost } from '../../interfaces/post.interfaces';
import { ChallangeService } from '../../services/challange.service';
import { ChallangeDocument } from '../../interfaces/challange.model';
import { CommentsComponent } from '../comments/comments.component';
import { Router } from '@angular/router'; // NEW: Import Router

@Component({
  selector: 'app-post-participation',
  standalone: true,
  imports: [CommonModule, DatePipe, CommentsComponent],
  templateUrl: './post-participation.component.html',
  styleUrl: './post-participation.component.css'
})
export class PostParticipationComponent implements OnInit {
  @Input() post!: UserPost;
  showComments: boolean = false;
  contestName: string | undefined;
  // NEW: To store the contest ID for navigation
  contestIdForNavigation: string | undefined;

  constructor(
    private challangeService: ChallangeService,
    private router: Router // NEW: Inject Router
  ) { }

  ngOnInit(): void {
    if (this.post.concursoId) {
      this.contestIdForNavigation = this.post.concursoId; // Store the ID
      this.challangeService.getChallangeById(this.post.concursoId).subscribe({
        next: (concurso: ChallangeDocument) => {
          this.contestName = concurso.nombre;
        },
        error: (err) => {
          console.error(`Error fetching contest for post ${this.post.id}:`, err);
          this.contestName = 'Concurso Desconocido';
        }
      });
    }
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  // NEW: Navigation method
  goToContestDetails(): void {
    if (this.contestIdForNavigation) {
      this.router.navigate(['/challangeDetails', this.contestIdForNavigation]);
    } else {
      console.warn('Cannot navigate: Contest ID is not available.');
    }
  }
}