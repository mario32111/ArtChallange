// header.component.ts
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router'; // Asegúrate de importar Router
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

  isScrolled = false; // Nueva propiedad para el efecto de scr
  private searchSubject = new Subject<string>();

  userData = getParsedLocalStorageItem<AuthResponse>('user');
  imgUrl = this.userData?.user?.photoURL || 'https://www.gravatar.com/avatar';
  userName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private router: Router // Inyecta el Router
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchValue => {
      this.performSearch(searchValue);
    });
  }

   // HostListener para detectar el scroll en la ventana
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Si el scroll vertical es mayor a 50px (puedes ajustar este valor)
    if (window.scrollY > 50) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
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
        //console.log('Search results:', this.searchResults);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.searchResults = [];
        this.showSearchResults = false;
      },
      complete: () => {
        //console.log('Search completed.');
      }
    });
  }

  selectSearchResult(user: any) {
    //console.log('Selected user:', user.displayName);
    this.searchBarValue = user.displayName;
    this.showSearchResults = false;

    // CAMBIO AQUI: Navega a '/personalProfile' y pasa el 'uid' del usuario
    this.router.navigate(['/personalProfile', user.uid]);
  }
}
