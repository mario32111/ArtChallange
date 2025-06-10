import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { ChallangeDetailsComponent } from '../challange-details/challange-details.component';
import { Concurso } from '../../interfaces/challange.model';
import { ChallangeService } from '../../services/challange.service';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'concurso-usuario',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ChallangeDetailsComponent, HeaderSmallComponent],
  templateUrl: './concurso-usuario.component.html',
  styleUrl: './concurso-usuario.component.css'
})
export class ConcursoUsuario implements OnInit {
  showSmallHeader = false;
  concursosRecomendados: Concurso[] = [];
  concursoSeleccionado: any = null;

  constructor(
    private service: ChallangeService,
    private auth: Auth,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.showSmallHeader = screenWidth < 800;
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadUserChallanges(user.uid);
      } else {
        console.warn('Usuario no autenticado');
      }
    });
  }

  loadUserChallanges(uid: string) {
    this.service.getUserChallanges(uid).subscribe((challangeIds: string[]) => {
      challangeIds.forEach((id) => {
        this.service.getChallangeById(id).subscribe((concurso: Concurso) => {
          this.concursosRecomendados.push(concurso);
        });
      });
    });
  }

  verMas(concurso: any) {
    this.concursoSeleccionado = concurso;
  }

  cerrarDetalles() {
    this.concursoSeleccionado = null;
  }

  verDetalleConcurso(concurso: Concurso) {
  this.router.navigate(['/challangeDetails', concurso.id]);
  }
}
