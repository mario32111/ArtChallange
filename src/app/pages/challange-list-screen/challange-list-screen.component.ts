import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { HeaderComponent } from '../../shared/header/header.component';
import { ChallangeDocument } from '../../interfaces/challange.model'; // Make sure this path is correct
import { ChallangeService } from '../../services/challange.service';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-challange-list-screen',
  standalone: true, // Indicar que el componente es standalone
  imports: [CommonModule, HeaderComponent, HeaderSmallComponent], // Agregar CommonModule para usar *ngFor
  templateUrl: './challange-list-screen.component.html',
  styleUrl: './challange-list-screen.component.css'
})
export class ChallangeListScreenComponent implements OnInit {
  constructor(private service: ChallangeService, private auth: Auth, private router: Router) {
    this.checkScreenSize(); // Verificar tamaño de pantalla al cargar
  }

  showSmallHeader = false;
  signedUpChallangeIds: string[] = [];
  concursosRecomendados: ChallangeDocument[] = [];
  concursoSeleccionado: ChallangeDocument | null = null; // Ensure type is ChallangeDocument or null

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
    /* this.insertarConcursos();
    */
    this.loadUserChallanges();

    this.service.getAllChallanges().subscribe(
      (data: ChallangeDocument[]) => {
        console.log('Concursos obtenidos:', data);
        this.concursosRecomendados = data;
      },
      (error) => {
        console.error('Error al obtener los concursos:', error);
      }
    );
  }

  // This method might be for initial data population, ensure it's handled correctly
  // if you're pulling data from Firestore and not inserting it here.
  insertarConcursos(): void {
    // Example ChallangeDocument data (replace with your actual data)
    const exampleChallange: ChallangeDocument = {
      nombre: "Concurso de Primavera",
      organizador: "Naturaleza Viva",
      categoria: "Fotografía de Paisajes",
      inscripcionCosto: 50,
      startDate: new Date("2025-03-01T00:00:00Z"),
      endDate: new Date("2025-03-31T23:59:59Z"),
      announcementDate: new Date("2025-04-15T12:00:00Z"),
      premios: ["Cámara Canon EOS", "Publicación en revista", "1000 MXN"],
      descripcionLarga: "Captura la belleza de la primavera en tu lente. Muestra la vida que florece, los colores vibrantes y la energía renovada de la naturaleza.",
      imagen: "https://example.com/primavera.jpg",
      hashtag: "#PrimaveraEnLente",
      etiquetasRedes: ["@NaturalezaVivaOficial"],
      instruccionesParticipacion: [
        "Toma una foto original de un paisaje primaveral.",
        "Súbela a Instagram con el hashtag #PrimaveraEnLente.",
        "Etiqueta a @NaturalezaVivaOficial.",
        "Completa el formulario de inscripción en nuestro sitio web."
      ],
      estado: 'abierto',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // If you have a list of contests to insert, iterate over it:
    // For now, this is just an example of how you might use `createChallange`
    this.service.createChallange(exampleChallange)
      .then((response) => console.log('Concurso creado:', response))
      .catch((error) => console.error('Error al crear concurso:', error));
  }

  verDetalleConcurso(concurso: ChallangeDocument) {
    this.router.navigate(['/challangeDetails', concurso.id]);
  }

  async inscribirse(concurso: ChallangeDocument) {
    try {
      const user$ = user(this.auth);
      const userData = await firstValueFrom(user$);

      if (!userData) {
        alert('Debes iniciar sesión para inscribirte.');
        return;
      }

      const uid = userData.uid;

      this.service.isUserSignedUp(uid, concurso.id!).subscribe(async (alreadySigned) => { // Use concurso.id! as it should exist here
        if (alreadySigned) {
          alert('Ya estás inscrito en este concurso.');
        } else {
          await this.service.signUpUserToChallange(uid, concurso.id!); // Use concurso.id!
          alert('¡Inscripción exitosa!');
        }
      });
    } catch (error) {
      console.error('Error al inscribirse:', error);
      alert('Hubo un error al intentar inscribirte.');
    }
  }

  async loadUserChallanges() {
    const userData = await firstValueFrom(user(this.auth));
    if (userData) {
      this.service.getUserChallanges(userData.uid).subscribe(ids => {
        this.signedUpChallangeIds = ids;
      });
    }
  }

  cerrarDetalles() {
    this.concursoSeleccionado = null;
  }
}
