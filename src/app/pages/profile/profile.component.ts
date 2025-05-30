import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeaderSmallComponent } from '../../shared/header-small/header-small.component';
import { CommonModule } from '@angular/common';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, HeaderSmallComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  constructor(private userService: UserService) {
    this.checkScreenSize(); // Verificar tamaño de pantalla al cargar
  }

  ngOnInit(): void {
    this.userService.getUserByUid("dwWJYd06GdOY009Z6OAFpW5O8Mc2").subscribe({
      next: (user: any) => {
        console.log('Usuario obtenido:', user);
      }
      , error: (error: any) => {
        console.error('Error al obtener el usuario:', error);
      }
  }
    );
  }
  showSmallHeader = false;
  mostrarContenido = true;
  userData = getParsedLocalStorageItem<AuthResponse>('user');
  imgUrl = this.userData?.user?.photoURL || 'https://www.gravatar.com/avatar';
  userName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';



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
}
