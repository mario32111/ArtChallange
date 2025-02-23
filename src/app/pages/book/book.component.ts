import { Component } from '@angular/core';
import { SmallHeaderComponent } from '../../shared/small-header/small-header.component';

@Component({
  selector: 'app-book',
  imports: [
    SmallHeaderComponent
  ],
  standalone: true,
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {

}
