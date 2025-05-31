import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { ActivatedRoute } from '@angular/router';
import { ChallangeService } from '../../services/challange.service';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-challange-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeaderSmallComponent],
  templateUrl: './challange-details.component.html',
  styleUrl: './challange-details.component.css'
})
export class ChallangeDetailsComponent implements OnInit {
  @Input() concurso: any;
  @Output() volver = new EventEmitter<void>();

  isSignedUp = false;  // <--- flag to control button visibility
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
      });

      // Get current user
      const userData = await firstValueFrom(user(this.auth));
      if (userData && id) {
        // Check if user is already signed up
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
          await this.service.signUpUserToChallange(uid, this.concurso.id);
          alert('¡Inscripción exitosa!');
          this.isSignedUp = true;  // <-- Hide button after joining
          // this.volver.emit(); // Optional: close details and return to list
        }
      });
    } catch (error) {
      console.error('Error al inscribirse:', error);
      alert('Hubo un error al intentar inscribirte.');
    }
  }
}
