import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { PostChallangeResultsComponent } from '../../shared/post-challange-results/post-challange-results.component';
import { PostParticipationComponent } from '../../shared/post-participation/post-participation.component';
import { PostRequerimentsComponent } from '../../shared/post-requeriments/post-requeriments.component';
import { RouterModule } from '@angular/router';

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
export class HomeComponent {
  showSmallHeader = false;
  mostrarContenido = true;

  constructor() {
    this.checkScreenSize(); // Verificar tamaño de pantalla al cargar
  }

  // Detectar cambios de tamaño de pantalla
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }


  toggleContenido() {
    this.mostrarContenido = !this.mostrarContenido;
  }

  // Verificar si la pantalla es pequeña (< 768px por ejemplo)
  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.showSmallHeader = screenWidth < 800; // Cambia a header pequeño si es menor a 768px
  }
}
