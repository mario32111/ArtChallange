// profile.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { CommonModule } from '@angular/common';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, HeaderSmallComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  // Propiedad para almacenar el UID del perfil que se está visualizando
  profileUid: string | null = null;
  // Propiedad para almacenar los datos del perfil que se ha cargado
  userProfileData: any = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute // Inyecta ActivatedRoute para leer parámetros de la URL
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la URL
    this.route.paramMap.subscribe(params => {
      this.profileUid = params.get('uid'); // Obtiene el valor del parámetro 'uid'
      if (this.profileUid) {
        // Si hay un UID en la URL, busca el perfil de ese usuario
        this.userService.getUserByUid(this.profileUid).subscribe({
          next: (user: any) => {
            this.userProfileData = user; // Almacena los datos del perfil
            console.log('Perfil de usuario obtenido:', this.userProfileData);
          },
          error: (error: any) => {
            console.error('Error al obtener el perfil del usuario:', error);
            // Podrías redirigir a una página de "perfil no encontrado" o mostrar un mensaje
          }
        });
      } else {
        // Opcional: Si no hay UID en la URL, puedes cargar el perfil del usuario autenticado
        // O redirigir a una ruta por defecto o a un error 404
        console.warn('No UID provided in route. Loading current user profile or handling default.');
        const currentUserData = getParsedLocalStorageItem<AuthResponse>('user');
        if (currentUserData && currentUserData.user && currentUserData.user.uid) {
          this.userService.getUserByUid(currentUserData.user.uid).subscribe({
            next: (user: any) => {
              this.userProfileData = user;
              console.log('Perfil del usuario actual obtenido:', this.userProfileData);
            },
            error: (error: any) => {
              console.error('Error al obtener el perfil del usuario actual:', error);
            }
          });
        } else {
          // No hay UID ni usuario logueado, manejar el caso (ej. redirigir a login o home)
          console.error('No se pudo cargar ningún perfil. Usuario no autenticado o UID faltante.');
          // this.router.navigate(['/login']); // Ejemplo de redirección
        }
      }
    });
  }

  showSmallHeader = false;
  mostrarContenido = true;
  userData = getParsedLocalStorageItem<AuthResponse>('user'); // Esto sigue siendo para el usuario LOGUEADO


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.showSmallHeader = screenWidth < 800;
  }
}
