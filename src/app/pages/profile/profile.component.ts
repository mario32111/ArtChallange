// profile.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { CommonModule } from '@angular/common';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  // Propiedad para el control del header responsive
  showSmallHeader = false;

  // showSuggestionsPanel y toggleSuggestionsPanel ya no son necesarios si no hay despliegue
  // showSuggestionsPanel: boolean = true; // Esta propiedad ya no controla el despliegue

  // Esto sigue siendo para el usuario LOGUEADO (tu propio perfil)
  userData = getParsedLocalStorageItem<AuthResponse>('user');

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.profileUid = params.get('uid');

      if (!this.profileUid) {
        const currentUserData = getParsedLocalStorageItem<AuthResponse>('user');
        if (currentUserData && currentUserData.user && currentUserData.user.uid) {
          this.profileUid = currentUserData.user.uid;
        } else {
          console.warn('No UID provided in route and no authenticated user. Redirecting to login/home.');
          // this.router.navigate(['/login']);
          return;
        }
      }

      if (this.profileUid) {
        this.userService.getUserByUid(this.profileUid).subscribe({
          next: (user: any) => {
            this.userProfileData = user;
            //console.log('Perfil de usuario obtenido:', this.userProfileData);
          },
          error: (error: any) => {
            console.error('Error al obtener el perfil del usuario:', error);
            // this.router.navigate(['/not-found']);
          }
        });
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    // Eliminamos adjustPanelVisibilityOnResize() ya que el panel no se oculta/muestra dinámicamente
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.showSmallHeader = screenWidth < 800;
  }

  // Eliminamos toggleSuggestionsPanel()
  // Eliminamos adjustPanelVisibilityOnResize()
}
