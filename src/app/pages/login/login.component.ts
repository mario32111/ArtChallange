import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.model';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.router.navigate(['/home']); // si ya está logueado, lo manda directo al home
    }
  }
  email: string = '';
  password: string = '';
  resultado!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService // Añade UserService aquí
  ) { }


  /*
    //* Este método es para crear un usuario de prueba
    async createTestUser() {
      const testUser: User= {
        uid: 'maritooooo_' + Math.random().toString(36).slice(2, 9),
        email: 'mARIO@example.com',
        username: 'MARIOuser'
      };

      try {
        await this.userService.createUser(testUser);
        console.log('Usuario creado:', testUser.uid);
      } catch (error) {
        console.error('Error creación:', error);
      }
    } */


  /*
    ?POR IMPLEMENTAR
    logout() {
      localStorage.removeItem('user');
      return this.auth.signOut(); // o lo que uses
    } */
  async loginWithEmail() {
    try {
      const user = await this.authService.loginWithEmail(this.email, this.password);
      console.log('Inicio de sesión exitoso:', user);
      // * Redirigir a otra página o mostrar mensaje
      this.router.navigate(['/home']);

      localStorage.setItem('user', JSON.stringify(user));

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // ? Aquí puedes mostrar un mensaje al usuario (ej: alert o snackbar)
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
