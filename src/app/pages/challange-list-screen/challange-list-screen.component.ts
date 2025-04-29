import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { HeaderComponent } from '../../shared/header/header.component';
import { ChallangeDetailsComponent } from '../challange-details/challange-details.component';


@Component({
  selector: 'app-challange-list-screen',
  standalone: true, // Indicar que el componente es standalone
  imports: [CommonModule, HeaderComponent, ChallangeDetailsComponent], // Agregar CommonModule para usar *ngFor
  templateUrl: './challange-list-screen.component.html',
  styleUrl: './challange-list-screen.component.css'
})
export class ChallangeListScreenComponent {
  concursosRecomendados = [
    { inscripcionCosto:'50',startDate:'1-1-1', endDate: '1-1-1',premios: 'Dineritooo',descripcion: 'Insertar descripcion',nombre: 'Arte Digital 2025', organizador: 'ArtHub', categoria: 'Digital', imagen: '../../../assets/images/dibujo.jpg' },
    { inscripcionCosto:'50',startDate:'1-1-1', endDate: '1-1-1',premios: 'Dineritooo',descripcion: 'Insertar descripcion',nombre: 'Pintura Moderna', organizador: 'Galería X', categoria: 'Pintura', imagen: '../../../assets/images/pintura.jpg' },
    { inscripcionCosto:'50',startDate:'1-1-1', endDate: '1-1-1',premios: 'Dineritooo',descripcion: 'Insertar descripcion',nombre: 'Escultura Creativa', organizador: 'Museo Creativo', categoria: 'Escultura', imagen: '../../../assets/images/pintura.jpg' },
    { inscripcionCosto:'50',startDate:'1-1-1', endDate: '1-1-1',premios: 'Dineritooo',descripcion: 'Insertar descripcion',nombre: 'Fotografía Urbana', organizador: 'PhotoWorld', categoria: 'Fotografía', imagen: '../../../assets/images/dibujo.jpg'},
    { inscripcionCosto:'50',startDate:'1-1-1', endDate: '1-1-1',premios: 'Dineritooo',descripcion: 'Insertar descripcion',nombre: 'Diseño Gráfico', organizador: 'GraphicLab', categoria: 'Diseño', imagen: '../../../assets/images/dibujo.jpg' }
  ];


  concursoSeleccionado: any = null;

  verMas(concurso: any) {
    this.concursoSeleccionado = concurso;
  }

  cerrarDetalles() {
    this.concursoSeleccionado = null;
  }
}
