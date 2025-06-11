import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-header-small',
  standalone: true, // Asegúrate de que sea standalone
  imports: [CommonModule, RouterModule, FormsModule], // Importa módulos necesarios
  templateUrl: './header-small.component.html',
  styleUrl: './header-small.component.css',
})
export class HeaderSmallComponent {
  // Propiedades para la visibilidad de modales
  showMessagesModal: boolean = false;
  showFriendsModal: boolean = false;
  showProfileModal: boolean = false;
  // showMobileMenu: boolean = false; // ¡Eliminado!

  messagesModalHover: boolean = false;
  friendsModalHover: boolean = false;
  profileModalHover: boolean = false;

  searchBarValue: string = '';
  onSearchBarFocus: boolean = false;
  showSearchResults: boolean = false;
  searchResults: any[] = [];

  private searchSubject = new Subject<string>();

  userData = getParsedLocalStorageItem<AuthResponse>('user');
  imgUrl = this.userData?.user?.photoURL || 'https://www.gravatar.com/avatar';
  userName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';

  // Añadir datos de ejemplo para el perfil móvil si no vienen de la API (si aún los necesitas para otros propósitos)
  mobileFollowers: string = '150k followers';
  mobileFollowing: string = '50 following';

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    public router: Router
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  // Métodos de navegación
  logout() {
    localStorage.removeItem('user');
    return this.auth.logOut();
  }

  // Métodos para alternar la visibilidad de los modales
  toggleMessagesModal() {
    this.closeAllModals();
    this.showMessagesModal = !this.showMessagesModal;
  }

  toggleFriendsModal() {
    this.closeAllModals();
    this.showFriendsModal = !this.showFriendsModal;
  }

  toggleProfileModal() {
    this.closeAllModals();
    this.showProfileModal = !this.showProfileModal;
  }

  // toggleMobileMenu() { // ¡Eliminado!
  //   this.showMobileMenu = !this.showMobileMenu;
  // }

  closeAllModals() {
    this.showMessagesModal = false;
    this.showFriendsModal = false;
    this.showProfileModal = false;
    // this.showMobileMenu = false; // ¡Eliminado!
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Modificado para ya no considerar el menú móvil
    if (
      !target.closest('.modal-container') &&
      !target.closest('.mobilemenu-bar') && // Aún se mantiene si hay interacción en la barra superior
      !target.closest('.search-results-dropdown')
    ) {
      this.closeAllModals();
      this.showSearchResults = false;
      // La lógica para cerrar el menú móvil ha sido eliminada
    }
  }

  // Métodos para el hover de los modales
  closeModalsOnLeave() {
    if (!this.messagesModalHover) this.showMessagesModal = false;
    if (!this.friendsModalHover) this.showFriendsModal = false;
    if (!this.profileModalHover) this.showProfileModal = false;
  }

  // Lógica de búsqueda
  onSearchInputChange() {
    this.searchSubject.next(this.searchBarValue);
    this.showSearchResults = this.searchBarValue.length > 0;
  }

  performSearch(searchValue: string) {
    if (searchValue.trim() === '') {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }

    this.profileService.getUsersByUsername(searchValue).subscribe({
      next: (users) => {
        this.searchResults = users;
        this.showSearchResults = this.searchResults.length > 0;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.searchResults = [];
        this.showSearchResults = false;
      },
      complete: () => {
        // console.log('Search completed.');
      },
    });
  }

  selectSearchResult(user: any) {
    this.searchBarValue = user.displayName;
    this.showSearchResults = false;
    this.router.navigate(['/personalProfile', user.uid]);
  }

  // Nuevo método para manejar la navegación (ya no cierra el menú móvil)
  navigateTo(path: string, uid?: string) {
    this.router.navigate(uid ? [path, uid] : [path]);
    // this.showMobileMenu = false; // ¡Eliminado!
    this.closeAllModals(); // Asegurarse de que no haya modales abiertos
  }
}
