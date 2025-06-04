import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { Component, EventEmitter, Input, Output, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Import RouterLink
import { ChallangeService } from '../../services/challange.service';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { ChallangeDocument } from '../../interfaces/challange.model'; // Make sure this path is correct

@Component({
  selector: 'app-challange-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeaderSmallComponent, DatePipe],
  templateUrl: './challange-details.component.html',
  styleUrl: './challange-details.component.css'
})
export class ChallangeDetailsComponent implements OnInit {
  @Input() concurso: ChallangeDocument | undefined; // Now explicitly ChallangeDocument
  @Output() volver = new EventEmitter<void>();

  isSignedUp = false;
  showSmallHeader = false;

  constructor(
    private route: ActivatedRoute,
    private service: ChallangeService,
    private auth: Auth
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
        }
      });
    } catch (error) {
      console.error('Error al inscribirse:', error);
      alert('Hubo un error al intentar inscribirte.');
    }
  }
}
