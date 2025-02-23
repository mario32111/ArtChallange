import { Component } from '@angular/core';
import { SmallHeaderComponent } from '../../shared/small-header/small-header.component';

@Component({
  selector: 'app-about',
  imports: [
    SmallHeaderComponent
  ],
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
