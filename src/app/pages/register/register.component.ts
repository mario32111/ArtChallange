// register.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


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

  constructor(private authService: AuthService) {}

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
    try {
      const user = await this.authService.loginWithGoogle();
      console.log('Usuario autenticado (Google):', user);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }

  async registerWithEmail() {
    // Obtén los valores actuales del formulario
    const { correo, password } = this.formularioValidacion.value;

    if (!this.formularioValidacion.valid) {
      this.resultado = "Formulario Invalido"
      console.log(correo, password);
      console.error('Correo o contraseña vacíos');
      return;
    }
    this.resultado = "Formulario Valido"

    try {
      const user = await this.authService.registerWithEmail(correo!, password!);
      console.log('Usuario registrado (Email):', user);
      // Redirige o muestra mensaje
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }

}
