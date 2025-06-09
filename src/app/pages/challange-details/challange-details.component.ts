import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChallangeService } from '../../services/challange.service';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { ChallangeDocument } from '../../interfaces/challange.model';
import { UserPostsService } from '../../services/user-post.service';
import { UserPost } from '../../interfaces/post.interfaces';
import { CreateUserPostComponent } from '../create-user-post/create-user-post.component';
import { PostParticipationComponent } from '../../shared/post-participation/post-participation.component'; // NEW: Import PostParticipationComponent

@Component({
  selector: 'app-challange-details',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeaderSmallComponent,
    DatePipe,
    CreateUserPostComponent,
    PostParticipationComponent // NEW: Add PostParticipationComponent to imports
  ],
  templateUrl: './challange-details.component.html',
  styleUrl: './challange-details.component.css',
})
export class ChallangeDetailsComponent implements OnInit {
  @Input() concurso: ChallangeDocument | undefined;
  @Output() volver = new EventEmitter<void>();

  isSignedUp = false;
  showSmallHeader = false;
  contestPosts: UserPost[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: ChallangeService,
    private auth: Auth,
    private userPostsService: UserPostsService
  ) {
    this.checkScreenSize();
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getChallangeById(id).subscribe((concurso) => {
        this.concurso = concurso;
        // Convert Firestore Timestamps or ISO strings to Date objects if needed
        if (this.concurso) {
          if (typeof this.concurso.startDate === 'string') {
            this.concurso.startDate = new Date(this.concurso.startDate);
          }
          if (typeof this.concurso.endDate === 'string') {
            this.concurso.endDate = new Date(this.concurso.endDate);
          }
          if (typeof this.concurso.announcementDate === 'string') {
            this.concurso.announcementDate = new Date(this.concurso.announcementDate);
          }
          if (typeof this.concurso.createdAt === 'string') {
            this.concurso.createdAt = new Date(this.concurso.createdAt);
          }
          if (typeof this.concurso.updatedAt === 'string') {
            this.concurso.updatedAt = new Date(this.concurso.updatedAt);
          }
          // If Firebase Timestamps are returned, you might need:
          // this.concurso.startDate = (this.concurso.startDate as any).toDate();
          // etc.
        }
        this.loadContestPosts(id);
      });

      const userData = await firstValueFrom(user(this.auth));
      if (userData && id) {
        this.service.isUserSignedUp(userData.uid, id).subscribe((signedUp) => {
          this.isSignedUp = signedUp;
        });
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.showSmallHeader = window.innerWidth < 800;
  }

  emitirVolver() {
    this.volver.emit();
  }

  async unirseAlConcurso() {
    if (!this.concurso || !this.concurso.id) {
      alert('No se pudo encontrar la información del concurso.');
      return;
    }

    try {
      const userData = await firstValueFrom(user(this.auth));

      if (!userData) {
        alert('Debes iniciar sesión para inscribirte.');
        return;
      }

      const uid = userData.uid;

      this.service.isUserSignedUp(uid, this.concurso.id).subscribe(async (alreadySigned) => {
        if (alreadySigned) {
          alert('Ya estás inscrito en este concurso.');
        } else {
          await this.service.signUpUserToChallange(uid, this.concurso!.id!);
          alert('¡Inscripción exitosa!');
          this.isSignedUp = true;
          // After successful signup, reload posts (though no new posts will be there yet)
          // to make the post creation section visible.
          if (this.concurso?.id) {
            this.loadContestPosts(this.concurso.id);
          }
        }
      });
    } catch (error) {
      console.error('Error al inscribirse:', error);
      alert('Hubo un error al intentar inscribirte.');
    }
  }

  loadContestPosts(concursoId: string): void {
    this.userPostsService.getPostsByConcursoId(concursoId).subscribe({
      next: (posts: UserPost[]) => {
        // Ensure posts are sorted by date if you want newest first
        this.contestPosts = posts.sort((a, b) => b.fechaPublicacion.getTime() - a.fechaPublicacion.getTime());
        console.log('Posts for this contest:', this.contestPosts);
      },
      error: (err) => {
        console.error('Error loading contest posts:', err);
      }
    });
  }

  onPostCreated(): void {
    if (this.concurso?.id) {
      this.loadContestPosts(this.concurso.id); // Reload posts after a new one is created
    }
  }
}