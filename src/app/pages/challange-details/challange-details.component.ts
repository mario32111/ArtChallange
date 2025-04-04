import { CommonModule } from '@angular/common';
import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-challange-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './challange-details.component.html',
  styleUrl: './challange-details.component.css'
})
export class ChallangeDetailsComponent {
  @Input() concurso: any;

  unirseAlConcurso() {
    alert(`Te has unido al concurso: ${this.concurso.nombre}`);
  }
}
