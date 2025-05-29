import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { HeaderComponent } from '../../shared/header/header.component';
import { ChallangeDetailsComponent } from '../challange-details/challange-details.component';
import { Concurso } from '../../interfaces/challange.model';
import { ChallangeService } from '../../services/challange.service';


@Component({
  selector: 'app-challange-list-screen',
  standalone: true, // Indicar que el componente es standalone
  imports: [CommonModule, HeaderComponent, ChallangeDetailsComponent], // Agregar CommonModule para usar *ngFor
  templateUrl: './challange-list-screen.component.html',
  styleUrl: './challange-list-screen.component.css'
})
export class ChallangeListScreenComponent implements OnInit {
  constructor(private service: ChallangeService) {}

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
  concursosRecomendados: Concurso[] = [
    {
      inscripcionCosto: '150',
      startDate: '2025-03-01',
      endDate: '2025-04-15',
      premios: '1er lugar: $5,000 MXN, 2do: $3,000 MXN',
      descripcion: 'Concurso enfocado en obras digitales con temática futurista.',
      nombre: 'Arte Digital 2025',
      organizador: 'ArtHub',
      categoria: 'Digital',
      imagen: '../../../assets/images/dibujo.jpg'
    },
    {
      inscripcionCosto: '100',
      startDate: '2025-05-10',
      endDate: '2025-06-20',
      premios: '1er lugar: Exposición en Galería X y $10,000 MXN',
      descripcion: 'Pinturas modernas que desafíen los estilos tradicionales.',
      nombre: 'Pintura Moderna',
      organizador: 'Galería X',
      categoria: 'Pintura',
      imagen: '../../../assets/images/pintura.jpg'
    },
    {
      inscripcionCosto: '80',
      startDate: '2025-07-01',
      endDate: '2025-08-15',
      premios: '1er lugar: Trofeo + $7,000 MXN',
      descripcion: 'Esculturas innovadoras con materiales reciclados.',
      nombre: 'Escultura Creativa',
      organizador: 'Museo Creativo',
      categoria: 'Escultura',
      imagen: '../../../assets/images/pintura.jpg'
    },
    {
      inscripcionCosto: '120',
      startDate: '2025-09-05',
      endDate: '2025-10-10',
      premios: 'Publicación en revista + $6,000 MXN',
      descripcion: 'Fotografía urbana que capture la esencia de las ciudades modernas.',
      nombre: 'Fotografía Urbana',
      organizador: 'PhotoWorld',
      categoria: 'Fotografía',
      imagen: '../../../assets/images/pintura.jpg'
    },
    {
      inscripcionCosto: '90',
      startDate: '2025-11-01',
      endDate: '2025-12-10',
      premios: 'Curso avanzado en diseño gráfico y $4,000 MXN',
      descripcion: 'Diseño gráfico con impacto visual y mensaje social.',
      nombre: 'Diseño Gráfico',
      organizador: 'GraphicLab',
      categoria: 'Diseño',
      imagen: '../../../assets/images/pintura.jpg'
    }
  ];

  concursoSeleccionado: any = null;


    insertarConcursos(): void {
    this.concursosRecomendados.forEach((concurso) => {
      this.service.createChallange(concurso)
        .then((response) => console.log('Concurso creado:', response))
        .catch((error) => console.error('Error al crear concurso:', error));
    });
  }
  verMas(concurso: any) {
    this.concursoSeleccionado = concurso;
  }

  cerrarDetalles() {
    this.concursoSeleccionado = null;
  }
}
