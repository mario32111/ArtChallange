import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { HeaderComponent } from '../../shared/header/header.component';
import { ChallangeDetailsComponent } from '../challange-details/challange-details.component';
import { Concurso } from '../../interfaces/challange.model';
import { ChallangeService } from '../../services/challange.service';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';


@Component({
  selector: 'app-challange-list-screen',
  standalone: true, // Indicar que el componente es standalone
  imports: [CommonModule, HeaderComponent, ChallangeDetailsComponent, HeaderSmallComponent], // Agregar CommonModule para usar *ngFor
  templateUrl: './challange-list-screen.component.html',
  styleUrl: './challange-list-screen.component.css'
})
export class ChallangeListScreenComponent implements OnInit {
  constructor(private service: ChallangeService) {
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
