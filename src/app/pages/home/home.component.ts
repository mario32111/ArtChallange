import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-home',
  /*   imports: [
      HeaderComponent,
    ], */
imports: [HeaderComponent, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  modalType: string = '';
  showModal: boolean = false;

  toggleModal(type: string) {
    this.modalType = type;
    this.showModal = !this.showModal;
  }
 }
