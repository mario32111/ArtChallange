import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';

@Component({
  selector: 'app-challange-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeaderSmallComponent],
  templateUrl: './challange-details.component.html',
  styleUrl: './challange-details.component.css'
})
export class ChallangeDetailsComponent {
  @Input() concurso: any;
  @Output() volver = new EventEmitter<void>(); // 🔁 Evento que se enviará al padre

  constructor() {
    this.checkScreenSize(); // Verificar tamaño de pantalla al cargar

  }


  showSmallHeader = false;

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

  emitirVolver() {
    this.volver.emit(); // ⬅️ Emitimos el evento al padre
  }

  unirseAlConcurso() {
    alert(`Te has unido al concurso: ${this.concurso.nombre}`);
  }
}
