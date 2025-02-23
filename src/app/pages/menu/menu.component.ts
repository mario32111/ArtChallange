import { Component } from '@angular/core';
import { SmallHeaderComponent } from '../../shared/small-header/small-header.component';

@Component({
  selector: 'app-menu',
  imports: [
    SmallHeaderComponent,
  ],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

}
