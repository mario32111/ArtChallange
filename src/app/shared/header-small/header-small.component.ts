import { Component } from '@angular/core';

@Component({
  selector: 'app-header-small',
  imports: [],
  templateUrl: './header-small.component.html',
  styleUrl: './header-small.component.css'
})
export class HeaderSmallComponent {
  menuVisible: boolean = false;

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }
}
