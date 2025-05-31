import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  showMessagesModal: boolean = false;
  showFriendsModal: boolean = false;
  showProfileModal: boolean = false;
  showMobileMenu: boolean = false;

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

  constructor(
    private auth: AuthService,
    private profileService: ProfileService
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchValue => {
      this.performSearch(searchValue);
    });
  }

  logout() {
    localStorage.removeItem('user');
    return this.auth.logOut();
  }

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

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeAllModals() {
    this.showMessagesModal = false;
    this.showFriendsModal = false;
    this.showProfileModal = false;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.modal-container') &&
      !target.closest('.navbar_icons') &&
      !target.closest('.navbar_user') &&
      !target.closest('.search-results-dropdown')
    ) {
      this.closeAllModals();
      this.showSearchResults = false;
    }
  }

  closeModalsOnLeave() {
    if (!this.messagesModalHover) this.showMessagesModal = false;
    if (!this.friendsModalHover) this.showFriendsModal = false;
    if (!this.profileModalHover) this.showProfileModal = false;
  }

  onSearchInputChange() {
    this.searchSubject.next(this.searchBarValue);
    // Mostrar resultados solo si hay algo escrito
    this.showSearchResults = this.searchBarValue.length > 0;
  }

  performSearch(searchValue: string) {
    if (searchValue.trim() === '') {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }

    // Llamar al servicio y manejar la respuesta asíncrona
    this.profileService.getUsersByUsername(searchValue).subscribe({
      next: (users) => {
        // Asigna directamente los usuarios obtenidos del servicio
        // Si el servicio ya filtra por "empieza por", no necesitas un filtro adicional aquí.
        this.searchResults = users;
        this.showSearchResults = this.searchResults.length > 0; // Solo muestra si hay resultados
        console.log('Search results:', this.searchResults);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.searchResults = []; // Limpia los resultados en caso de error
        this.showSearchResults = false;
      },
      complete: () => {
        console.log('Search completed.');
      }
    });
  }

  selectSearchResult(user: any) {
    console.log('Selected user:', user.name); // Asumiendo que 'name' es una propiedad en tu objeto de usuario
    this.searchBarValue = user.name; // O user.username, dependiendo de tu modelo
    this.showSearchResults = false;
  }
}
