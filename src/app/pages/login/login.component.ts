import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  resultado!: string;

  constructor(private authService: AuthService, private router: Router) {}

  async loginWithEmail() {
    try {
      const user = await this.authService.loginWithEmail(this.email, this.password);
      console.log('Inicio de sesión exitoso:', user);
      // Redirigir a otra página o mostrar mensaje
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Aquí puedes mostrar un mensaje al usuario (ej: alert o snackbar)
      this.resultado = 'Error al iniciar sesión. Verifica tus credenciales.';
    }
  }

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle();
      console.log('Usuario autenticado (Google):', user);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }
}
