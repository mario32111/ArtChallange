// create-user-post.component.ts
import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core'; // Import Input
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadComponent } from '../../shared/upload/upload.component';
import { UserPostsService } from '../../services/user-post.service';
import { UserPost } from '../../interfaces/post.interfaces';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { ChallangeService } from '../../services/challange.service';
import { ChallangeDocument } from '../../interfaces/challange.model';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { forkJoin, of, Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-create-user-post',
  standalone: true,
  imports: [CommonModule, FormsModule, UploadComponent],
  templateUrl: './create-user-post.component.html',
  styleUrls: ['./create-user-post.component.css'],
})
export class CreateUserPostComponent implements OnInit {
  @Output() postCreated = new EventEmitter<void>();
  @Input() preSelectedConcursoId: string | undefined; // NEW: Input for contest ID

  caption: string = '';
  hashtags: string = '';
  etiquetas: string = '';
  imageUrl: string = '';
  isSubmitting = false;
  uploadCompleted = false;
  showImageUpload = false;
  userData = getParsedLocalStorageItem<AuthResponse>('user');
  imgUrl = this.userData?.user?.photoURL || 'https://www.gravatar.com/avatar';
  userName =
    this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';

  user = getParsedLocalStorageItem<AuthResponse>('user');

  concursos: ChallangeDocument[] = [];
  selectedConcursoId: string | null = null;

  constructor(
    private userPostsService: UserPostsService,
    private challangeService: ChallangeService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    // If a pre-selected contest ID is provided, set it.
    // This will happen when used within challenge-details component.
    if (this.preSelectedConcursoId) {
      this.selectedConcursoId = this.preSelectedConcursoId;
    } else {
      // Otherwise, load user's signed-up contests for the dropdown.
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.loadUserSignedUpConcursos(user.uid);
        } else {
          console.warn('Usuario no autenticado. No se cargarán los concursos de usuario.');
        }
      });
    }
  }

  toggleImageUpload() {
    this.showImageUpload = !this.showImageUpload;
    // Only reset selectedConcursoId if it's not pre-selected from parent
    if (!this.showImageUpload && !this.preSelectedConcursoId) {
      this.selectedConcursoId = null;
    }
  }

  onImageUploaded(url: string) {
    this.imageUrl = url;
    this.uploadCompleted = true;
  }

  private loadUserSignedUpConcursos(uid: string): void {
    this.challangeService.getUserChallanges(uid).pipe(
      switchMap((challangeIds: string[]) => {
        if (challangeIds.length === 0) {
          return of([]);
        }
        const challengeDetailObservables: Observable<ChallangeDocument>[] = challangeIds.map(id =>
          this.challangeService.getChallangeById(id).pipe(
            catchError(error => {
              console.warn(`Error fetching challenge with ID ${id}:`, error);
              return of(null as any);
            })
          )
        );
        return forkJoin(challengeDetailObservables);
      })
    ).subscribe({
      next: (concursosData: ChallangeDocument[]) => {
        this.concursos = concursosData.filter(
          (concurso) => concurso && concurso.estado === 'abierto'
        ) as ChallangeDocument[];
        console.log('Concursos cargados para el usuario:', this.concursos);
      },
      error: (err) => {
        console.error('Error al cargar los concursos del usuario:', err);
      },
    });
  }


  async submitPost() {
    // If preSelectedConcursoId is set, it overrides the dropdown selection for the post.
    const finalConcursoId = this.preSelectedConcursoId || this.selectedConcursoId;

    if (!this.imageUrl || !this.caption.trim()) {
      alert('Por favor, agrega una imagen y una descripción.');
      return;
    }

    // Optional: If posting to a contest, ensure one is selected
    if (this.preSelectedConcursoId && !finalConcursoId) {
        alert('Error: El ID del concurso no está disponible para esta publicación.');
        return;
    }


    this.isSubmitting = true;

    const post: UserPost = {
      tipo: 'participacion',
      autorId: this.user?.user?.uid || '',
      autorNombre:
        this.user?.user?.providerData?.[0]?.displayName || 'Anonimo',
      imagenUrl: this.imageUrl,
      descripcion: this.caption,
      hashtags: this.hashtags.split(',').map((tag) => tag.trim()),
      etiquetas: this.etiquetas.split(',').map((tag) => tag.trim()),
      fechaPublicacion: new Date(),
      likes: [],
      comentarios: [],
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      ...(finalConcursoId && { concursoId: finalConcursoId }), // Use finalConcursoId
    };

    try {
      await this.userPostsService.createUserPost(post);
      this.postCreated.emit();
      alert('Post creado exitosamente');
      // Reset form
      this.caption = '';
      this.hashtags = '';
      this.etiquetas = '';
      this.imageUrl = '';
      this.uploadCompleted = false;
      // Do NOT reset selectedConcursoId if preSelectedConcursoId is present
      if (!this.preSelectedConcursoId) {
        this.selectedConcursoId = null;
      }
      this.showImageUpload = false;
    } catch (err) {
      console.error('Error al crear post:', err);
      alert('Hubo un error al crear el post. Inténtalo de nuevo.');
    } finally {
      this.isSubmitting = false;
    }
  }
}