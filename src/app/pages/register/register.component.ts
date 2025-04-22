// register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private authService: AuthService) {}

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle();
      console.log('Usuario autenticado:', user);
      // Redirect or handle success (e.g., navigate to dashboard)
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      // Show error message to user (e.g., using a toast/snackbar)
    }
  }
}
