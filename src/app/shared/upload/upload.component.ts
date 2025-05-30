// upload.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [ImageUploadService] // Proveemos el servicio a nivel de componente
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadResponse: any = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private imageUploadService: ImageUploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor selecciona un archivo';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.uploadResponse = null;

    this.imageUploadService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadResponse = response;
        this.isLoading = false;
        console.log('Imagen subida con éxito:', response);
      },
      error: (error) => {
        this.errorMessage = 'Error al subir la imagen';
        this.isLoading = false;
        console.error('Error al subir la imagen:', error);
      }
    });
  }
}
