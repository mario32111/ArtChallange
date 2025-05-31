import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ChallangeService } from '../../services/challange.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { ImageUploadService } from '../../services/image-upload.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-concurso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FormsModule, HttpClientModule], // Importaciones necesarias
  templateUrl: './concurso-form.component.html',
  styleUrls: ['./concurso-form.component.css'],
  providers: [ImageUploadService] // Proveemos el servicio a nivel de componente

})
export class ConcursoFormComponent {
  resultado!: string;
  miClase: string = "msg1";
  concursoForm: FormGroup;

  //variables de imagen
  selectedFile: File | null = null;
  uploadResponse: any = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder,
    private service: ChallangeService,
    private router: Router,
    private imageUploadService: ImageUploadService) {
    this.concursoForm = this.fb.group({
      nombre: ['', Validators.required],
      organizador: ['', Validators.required],
      categoria: ['', Validators.required],
      inscripcionCosto: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      premios: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }

  }

  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        this.errorMessage = 'Por favor selecciona un archivo';
        reject('Archivo no seleccionado');
        return;
      }

      this.isLoading = true;
      this.errorMessage = null;
      this.uploadResponse = null;

      this.imageUploadService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.uploadResponse = response;
          this.isLoading = false;
          const imageUrl = response.data.display_url;
          resolve(imageUrl); // ✅ devolvemos la URL
        },
        error: (error) => {
          this.errorMessage = 'Error al subir la imagen';
          this.isLoading = false;
          console.error('Error al subir la imagen:', error);
          reject(error);
        }
      });
    });
  }


  async onSubmit() {
    if (!this.concursoForm.valid) {
      this.resultado = "Alguno de los campos está vacío";
      this.miClase = "msg1";
      console.error('Alguno de los campos está vacío');
      return;
    }

    try {
      const imageUrl = await this.uploadImage(); // ✅ esperamos la URL
      const challangeData = {
        ...this.concursoForm.value,
        imagen: imageUrl // ✅ actualizamos el valor en el objeto
      };
      console.log('Datos del concurso:', challangeData);
      await this.service.createChallange(challangeData);

      console.log('Concurso creado exitosamente:', challangeData);
      this.resultado = "Concurso creado exitosamente";
      this.miClase = "msg2";
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error al crear el concurso:', error);
      this.resultado = 'Error al crear el concurso';
      this.miClase = "msg1";
    }
  }
}
