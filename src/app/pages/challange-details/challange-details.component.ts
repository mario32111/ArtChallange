import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output  } from '@angular/core';

@Component({
  selector: 'app-challange-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './challange-details.component.html',
  styleUrl: './challange-details.component.css'
})
export class ChallangeDetailsComponent {
  @Input() concurso: any;
  @Output() volver = new EventEmitter<void>(); // 🔁 Evento que se enviará al padre

  emitirVolver() {
    this.volver.emit(); // ⬅️ Emitimos el evento al padre
  }

  unirseAlConcurso() {
    alert(`Te has unido al concurso: ${this.concurso.nombre}`);
  }
}
