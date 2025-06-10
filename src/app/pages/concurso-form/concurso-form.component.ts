import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms'; // Importa FormArray
import { ChallangeService } from '../../services/challange.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { ImageUploadService } from '../../services/image-upload.service';
import { HttpClientModule } from '@angular/common/http';
import { PostsService } from '../../services/posts.service';
import { getParsedLocalStorageItem } from '../../../utils/storage.utils';
import { AuthResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-concurso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FormsModule, HttpClientModule],
  templateUrl: './concurso-form.component.html',
  styleUrls: ['./concurso-form.component.css'],
  providers: [ImageUploadService]
})
export class ConcursoFormComponent {
  resultado!: string;
  miClase: string = "msg1";
  concursoForm: FormGroup;

  selectedFile: File | null = null;
  uploadResponse: any = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder,
    private service: ChallangeService,
    private router: Router,
    private imageUploadService: ImageUploadService,
    private postService: PostsService) {
    this.concursoForm = this.fb.group({
      nombre: ['', Validators.required],
      slogan: [''], // Nuevo campo: opcional
      organizador: ['', Validators.required],
      categoria: ['', Validators.required],
      inscripcionCosto: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      announcementDate: [''], // Nuevo campo: opcional
      // Cambiamos 'premios' a un FormArray para manejar múltiples premios
      premios: this.fb.array([this.createPremioControl()]), // Inicializa con un premio
      descripcionCorta: [''], // Nuevo campo: opcional
      descripcion: ['', Validators.required], // Descripción larga existente
      hashtag: ['', Validators.required], // Nuevo campo
      // Cambiamos 'etiquetasRedes' a un FormArray para manejar múltiples etiquetas
      etiquetasRedes: this.fb.array([this.createEtiquetaControl()]), // Inicializa con una etiqueta
      // Cambiamos 'instruccionesParticipacion' a un FormArray
      instruccionesParticipacion: this.fb.array([this.createInstruccionControl()]), // Inicializa con una instrucción
      infoAdicionalLink: [''], // Nuevo campo: opcional
      // Estado se puede manejar en el backend o con un valor por defecto al crear
      // estado: ['proximo', Validators.required], // Opcional, si quieres controlarlo desde el form
    });
  }

  // Getter para acceder fácilmente a los premios como FormArray
  get premios(): FormArray {
    return this.concursoForm.get('premios') as FormArray;
  }

  // Método para crear un nuevo control de premio
  createPremioControl(): FormGroup {
    return this.fb.group({
      detalle: ['', Validators.required] // Por ejemplo, 'detalle' del premio
    });
  }

  // Método para añadir un premio al FormArray
  addPremio(): void {
    this.premios.push(this.createPremioControl());
  }

  // Método para remover un premio del FormArray
  removePremio(index: number): void {
    this.premios.removeAt(index);
  }

  // Getter para acceder fácilmente a las etiquetasRedes como FormArray
  get etiquetasRedes(): FormArray {
    return this.concursoForm.get('etiquetasRedes') as FormArray;
  }

  // Método para crear un nuevo control de etiqueta
  createEtiquetaControl(): FormGroup {
    return this.fb.group({
      handle: ['', Validators.required] // Por ejemplo, '@MiPagina'
    });
  }

  // Método para añadir una etiqueta al FormArray
  addEtiqueta(): void {
    this.etiquetasRedes.push(this.createEtiquetaControl());
  }

  // Método para remover una etiqueta del FormArray
  removeEtiqueta(index: number): void {
    this.etiquetasRedes.removeAt(index);
  }

  // Getter para acceder fácilmente a las instruccionesParticipacion como FormArray
  get instruccionesParticipacion(): FormArray {
    return this.concursoForm.get('instruccionesParticipacion') as FormArray;
  }

  // Método para crear un nuevo control de instrucción
  createInstruccionControl(): FormGroup {
    return this.fb.group({
      paso: ['', Validators.required] // Por ejemplo, 'Toma una foto...'
    });
  }

  // Método para añadir una instrucción al FormArray
  addInstruccion(): void {
    this.instruccionesParticipacion.push(this.createInstruccionControl());
  }

  // Método para remover una instrucción del FormArray
  removeInstruccion(index: number): void {
    this.instruccionesParticipacion.removeAt(index);
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
          resolve(imageUrl);
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
  userData = getParsedLocalStorageItem<AuthResponse>('user');
  userName = this.userData?.user?.providerData?.[0]?.displayName || 'Usuario Anónimo';
  userID = this.userData?.user.uid;
  async onSubmit() {
    if (!this.concursoForm.valid) {
      this.resultado = "Por favor, completa todos los campos requeridos.";
      this.miClase = "msg1";
      console.error('Formulario no válido. Campos faltantes o incorrectos.');
      // Puedes añadir más lógica aquí para mostrar qué campos son inválidos
      return;
    }

    try {
      const imageUrl = await this.uploadImage();
      const rawFormValue = this.concursoForm.value;

      // Transformar los FormArrays a arrays simples de strings
      const premiosArray = rawFormValue.premios.map((p: { detalle: string }) => p.detalle);
      const etiquetasArray = rawFormValue.etiquetasRedes.map((e: { handle: string }) => e.handle);
      const instruccionesArray = rawFormValue.instruccionesParticipacion.map((i: { paso: string }) => i.paso);

      const challangeData = {
        ...rawFormValue,
        imagen: imageUrl,
        premios: premiosArray,
        etiquetasRedes: etiquetasArray,
        instruccionesParticipacion: instruccionesArray,
        createdAt: new Date(),
        updatedAt: new Date(),
        estado: 'abierto'
      };


      //console.log('Datos del concurso a guardar:', challangeData);
      const res = await this.service.createChallange(challangeData);
      //console.log('Concurso creado exitosamente:', res);

      this.postService.createConvocatoriaPost({
        tipo: 'concurso',
        concursoRef: res, // Referencia al ID del concurso
        autorId: this.userID ?? '', // Reemplaza con el ID del usuario autenticado o una cadena vacía si es undefined
        autorNombre: this.userName, // Reemplaza con el nombre del usuario autenticado
        fechaPublicacion: new Date(),
        likes: [],
        comentarios: [],
        hashtags: [], // Puedes agregar hashtags si es necesario
        etiquetas: [], // Puedes agregar etiquetas si es necesario
        creadoEn: new Date(),
        actualizadoEn: new Date()
      }, res);


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
