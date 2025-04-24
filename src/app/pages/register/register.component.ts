// register.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  resultado!: string;
  miClase: string = "msg1";

  formularioValidacion = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(10)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rePassword: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.formularioValidacion.get('rePassword')?.addValidators(this.passwordValidator());

    // Revalida rePassword cuando password cambie
    this.formularioValidacion.get('password')?.valueChanges.subscribe(() => {
      this.formularioValidacion.get('rePassword')?.updateValueAndValidity();
    });
  }


  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let password = this.formularioValidacion.get('password')?.value;
      const rePassword = control.value;
      return password === rePassword ? null : { 'passwordMissMatched': true };
    };
  }


  //Funciones de autenticacion
  async loginWithGoogle() {
    const { correo, password } = this.formularioValidacion.value;

    try {
      const user = await this.authService.loginWithGoogle();
      console.log('Usuario autenticado (Google):', user);
      this.authService.loginWithEmail(correo!, password!);
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }

  async registerWithEmail() {
    // Obtén los valores actuales del formulario
    const { correo, password } = this.formularioValidacion.value;

    if (!this.formularioValidacion.valid) {
      this.resultado = "Alguno de los campos esta vacio"
      console.log(correo, password);
      console.error('Alguno de los campos esta vacio');
      return;
    }

    try {
      const user = await this.authService.registerWithEmail(correo!, password!);
      console.log('Usuario registrado (Email):', user);
      this.resultado = "Usuario registrado correctamente"
      this.miClase = "msg2"; // Cambia la clase para mostrar el mensaje de éxito
      this.authService.loginWithEmail(correo!, password!);
      this.router.navigate(['/home']);

      // Redirige o muestra mensaje
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);

      if (error.code === 'auth/email-already-in-use') {
        this.resultado = 'El usuario ya existe. Intenta con otro correo.';
      } else {
        this.resultado = 'Ocurrió un error al registrar el usuario. Intenta nuevamente.';
      }

      this.miClase = "msg1"; // clase para error
    }
  }

}
