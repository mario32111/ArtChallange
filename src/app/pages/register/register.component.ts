// register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle();
      console.log('Usuario autenticado (Google):', user);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }

  async registerWithEmail() {
    try {
      const user = await this.authService.registerWithEmail(this.email, this.password);
      console.log('Usuario registrado (Email):', user);
      // Redirige al dashboard o muestra mensaje
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      // Aquí podrías mostrar un toast o alert
    }
  }
}
