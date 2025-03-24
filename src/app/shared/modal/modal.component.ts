import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() modalType: string = ''; // 'comments', 'friends', 'profile'
  isVisible: boolean = false;

  toggleModal() {
    this.isVisible = !this.isVisible;
  }
}
