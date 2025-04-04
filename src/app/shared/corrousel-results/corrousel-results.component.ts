import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

import {
  CarouselComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  CarouselCaptionComponent,
  CarouselControlComponent,
  ThemeDirective
} from '@coreui/angular';

@Component({
  selector: 'app-corrousel-results',
  templateUrl: './corrousel-results.component.html',
  styleUrl: './corrousel-results.component.css',
  standalone: true,
  styles: [`
    /* Importa el CSS compilado */
    @import 'bootstrap/dist/css/bootstrap.min.css';

    /* Estilos específicos */
    :host{
      c-carousel {
    border-radius: 1rem !important; /* Bordes redondeados */
    overflow: hidden; /* Asegura que las imágenes también se redondeen */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); /* Sombra opcional */
    margin: 24px; /* Centra el carrusel en su contenedor */

    /* Personalización de las imágenes */
    img {
      border-radius: inherit; /* Hereda el redondeado del contenedor */
      object-fit: cover;
      height: 500px; /* Altura fija recomendada */
    }

    .fondoOscuro{
      background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro con opacidad */
      color: white; /* Texto blanco para contraste */
      padding: 1rem; /* Espaciado interno */
      border-radius: 1rem; /* Bordes redondeados inferiores */
    }
    .letraBlanca{
      color: white;
      font-weight: 300;
    }

  }
    }
  `],
  imports: [
    ThemeDirective,
    CarouselComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent,
    NgFor,
    CarouselItemComponent,
    CarouselCaptionComponent,
    CarouselControlComponent
  ]
})
export class CorrouselResultsComponent implements OnInit {
  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });

  ngOnInit(): void {
    this.slides[0] = {
      id: 0,
      src: '../../../assets/images/mascota1.jpg',
      title: 'Primer lugar',
      subtitle: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
    };
    this.slides[1] = {
      id: 1,
      src: '../../../assets/images/mascota2.jpg',
      title: 'Segundo lugar',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    };
    this.slides[2] = {
      id: 2,
      src: '../../../assets/images/mascota3.jpg',
      title: 'Tercer lugar',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
  }
}
