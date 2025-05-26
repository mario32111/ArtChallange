import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallangeService } from '../../services/challange.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-concurso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent], // Importaciones necesarias
  templateUrl: './concurso-form.component.html',
  styleUrls: ['./concurso-form.component.css']
})
export class ConcursoFormComponent {
  resultado!: string;
  miClase: string = "msg1";
  concursoForm: FormGroup;

  constructor(private fb: FormBuilder, private service: ChallangeService, private router: Router) {
    this.concursoForm = this.fb.group({
      nombre: ['', Validators.required],
      organizador: ['', Validators.required],
      categoria: ['', Validators.required],
      inscripcionCosto: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      premios: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (!this.concursoForm.valid) {
      this.resultado = "Alguno de los campos esta vacio"
      console.log("asdasd", this.concursoForm.value);
      this.miClase = "msg1"; // clase para error
      console.error('Alguno de los campos esta vacio');
      return;
    }



    try {
      await this.service.createChallange(this.concursoForm.value);
      console.log('Concurso creado exitosamente:', this.concursoForm.value);
      this.resultado = "Concurso creado exitosamente"
      this.miClase = "msg2"; // Cambia la clase para mostrar el mensaje de éxito
      this.router.navigate(['/home']);

    } catch (error: any) {
      console.error('Error al crear el concurso:', error);
      console.log("asdasd", this.concursoForm.value);
      this.resultado = 'Error al crear el concurso';

      this.miClase = "msg1"; // clase para error
    }
  }
}
