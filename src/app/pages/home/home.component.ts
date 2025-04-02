import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { CorrouselResultsComponent } from '../../shared/corrousel-results/corrousel-results.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, HeaderSmallComponent, CorrouselResultsComponent, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  showSmallHeader = false;

  constructor() {
    this.checkScreenSize(); // Verificar tamaño de pantalla al cargar
  }

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
}
