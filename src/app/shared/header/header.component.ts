import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
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


  userData = getParsedLocalStorageItem<AuthResponse>('user');
  imgUrl = this.userData?.user?.photoURL || 'https://www.gravatar.com/avatar';
  userName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';

  constructor(private auth: AuthService) {
  }

  logout() {
    localStorage.removeItem('user');
    return this.auth.logOut(); // o lo que uses
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
      !target.closest('.navbar_user')
    ) {
      this.closeAllModals();
    }
  }

  closeModalsOnLeave() {
    if (!this.messagesModalHover) this.showMessagesModal = false;
    if (!this.friendsModalHover) this.showFriendsModal = false;
    if (!this.profileModalHover) this.showProfileModal = false;
  }
}
