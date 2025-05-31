import { Component } from '@angular/core';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-header-small',
  imports: [],
  templateUrl: './header-small.component.html',
  styleUrl: './header-small.component.css'
})
export class HeaderSmallComponent {
  menuVisible: boolean = false;

  userData = getParsedLocalStorageItem<AuthResponse>('user');
  imgUrl = this.userData?.user?.photoURL || 'https://www.gravatar.com/avatar';


  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }
}
