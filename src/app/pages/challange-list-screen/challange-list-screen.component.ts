import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { HeaderComponent } from '../../shared/header/header.component';
import { ChallangeDetailsComponent } from '../challange-details/challange-details.component';
import { Concurso } from '../../interfaces/challange.model';
import { ChallangeService } from '../../services/challange.service';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';




@Component({
  selector: 'app-challange-list-screen',
  standalone: true, // Indicar que el componente es standalone
  imports: [CommonModule, HeaderComponent, ChallangeDetailsComponent, HeaderSmallComponent], // Agregar CommonModule para usar *ngFor
  templateUrl: './challange-list-screen.component.html',
  styleUrl: './challange-list-screen.component.css'
})
export class ChallangeListScreenComponent implements OnInit {
  constructor(private service: ChallangeService,private auth: Auth, private router: Router) {
    this.checkScreenSize(); // Verificar tamaño de pantalla al cargar

  }


  showSmallHeader = false;
  signedUpChallangeIds: string[] = [];


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
    this.loadUserChallanges();

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

  verDetalleConcurso(concurso: Concurso) {
    this.router.navigate(['/challangeDetails', concurso.id]);
  }

  async inscribirse(concurso: any) {
  try {
    const user$ = user(this.auth);
    const userData = await firstValueFrom(user$);

    if (!userData) {
      alert('Debes iniciar sesión para inscribirte.');
      return;
    }

    const uid = userData.uid;

    this.service.isUserSignedUp(uid, concurso.id).subscribe(async (alreadySigned) => {
      if (alreadySigned) {
        alert('Ya estás inscrito en este concurso.');
      } else {
        await this.service.signUpUserToChallange(uid, concurso.id);
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
