// upload.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() imageUploaded = new EventEmitter<string>(); // 👈 Add this line
  selectedFile: File | null = null;
  uploadResponse: any = null;
  errorMessage: string | null = null;
  isLoading:boolean = false;

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
      const imageUrl = response?.data?.url;
      if (imageUrl) {
        this.imageUploaded.emit(imageUrl); // ✅ EMIT the uploaded image URL
      }
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
