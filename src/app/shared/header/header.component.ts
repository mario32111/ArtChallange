import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs'; // Import for debouncing

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
  showSearchResults: boolean = false; // New: To control visibility of search results
  searchResults: any[] = []; // New: To store the search results (e.g., user objects)
  private searchSubject = new Subject<string>(); // New: For debouncing search input

  userData = getParsedLocalStorageItem<AuthResponse>('user');
  imgUrl = this.userData?.user?.photoURL || 'https://www.gravatar.com/avatar';
  userName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';

  constructor(private auth: AuthService) {
    // New: Subscribe to search input changes with a debounce time
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchValue => {
      this.performSearch(searchValue);
    });
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
      !target.closest('.navbar_user') &&
      !target.closest('.search-results-dropdown') // New: Exclude search results dropdown
    ) {
      this.closeAllModals();
      this.showSearchResults = false; // New: Close search results on outside click
    }
  }

  closeModalsOnLeave() {
    if (!this.messagesModalHover) this.showMessagesModal = false;
    if (!this.friendsModalHover) this.showFriendsModal = false;
    if (!this.profileModalHover) this.showProfileModal = false;
  }

  // New: Handle input changes in the search bar
  onSearchInputChange() {
    this.searchSubject.next(this.searchBarValue);
    this.showSearchResults = this.searchBarValue.length > 0; // Show if there's input
  }

  // New: Simulate a search for users (replace with actual API call)
  performSearch(searchValue: string) {
    if (searchValue.trim() === '') {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }

    // --- Replace this with your actual API call to search for users ---
    // Example: this.auth.searchUsers(searchValue).subscribe(results => {
    //   this.searchResults = results;
    //   this.showSearchResults = true; // Show results if there are any
    // });
    // --- End of replacement area ---

    // For demonstration, let's mock some results
    const mockUsers = [
      { name: 'Alice Smith', imageUrl: 'assets/images/user-2.jpg' },
      { name: 'Bob Johnson', imageUrl: 'assets/images/user-7.jpg' },
      { name: 'Charlie Brown', imageUrl: 'https://www.gravatar.com/avatar' },
      { name: 'Diana Prince', imageUrl: 'assets/images/user-2.jpg' },
    ];

    this.searchResults = mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  // New: Handle click on a search result
  selectSearchResult(user: any) {
    console.log('Selected user:', user.name);
    // You can navigate to the user's profile, populate the search bar, etc.
    this.searchBarValue = user.name;
    this.showSearchResults = false;
  }
}