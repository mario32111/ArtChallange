
import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { PostChallangeResultsComponent } from '../../shared/post-challange-results/post-challange-results.component';
import { PostParticipationComponent } from '../../shared/post-participation/post-participation.component';
import { PostRequerimentsComponent } from '../../shared/post-requeriments/post-requeriments.component';
import { RouterModule } from '@angular/router';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { ChallangeService } from '../../services/challange.service';
import { Concurso } from '../../interfaces/challange.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    HeaderSmallComponent,
    CommonModule,
    PostChallangeResultsComponent,
    PostParticipationComponent,
    PostRequerimentsComponent,
    RouterModule,
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  showSmallHeader = false;
  mostrarContenido = true;
  userData = getParsedLocalStorageItem<AuthResponse>('user');
  imgUrl = this.userData?.user?.photoURL || 'https://www.gravatar.com/avatar';
  showSuggestionsPanel: boolean = false; // Nueva propiedad para controlar la visibilidad del panel

  constructor(private service: ChallangeService, private router: Router) {
    this.checkScreenSize(); // Verificar tamaño de pantalla al cargar
/*     console.log(this.userName);
 */  }
  ngOnInit(): void {
    /*          this.insertarConcursos();
     */

    this.service.getAllChallanges().subscribe(
      (data: Concurso[]) => {
        console.log('Concursos obtenidos:', data);
        this.concursosRecomendados = data;
      },
      (error) => {
        console.error('Error al obtener los concursos:', error);
      }
    );

  }
  concursosRecomendados: Concurso[] = [];
  concursoSeleccionado: any = null;



  // Detectar cambios de tamaño de pantalla
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  // Verificar si la pantalla es pequeña (< 768px por ejemplo)
  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.showSmallHeader = screenWidth < 800; // Cambia a header pequeño si es menor a 768px
  }

  toggleSuggestionsPanel() {
    this.showSuggestionsPanel = !this.showSuggestionsPanel;
  }

  toggleContenido() {
    this.mostrarContenido = !this.mostrarContenido;
  }

  verDetalleConcurso(concurso: Concurso) {
    this.router.navigate(['/challangeDetails', concurso.id]);
  }


}
