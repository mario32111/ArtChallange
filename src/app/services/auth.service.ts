// auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private userService: UserService) { } // Inyecta Auth de Firebase v9

  async loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = signInWithPopup(this.auth, provider);
    return cred;
  }

  async registerWithEmail(email: string, password: string) {
    const cred = createUserWithEmailAndPassword(this.auth, email, password);
    return (await cred).user.uid
  }

    // 🔴 Agrega este método:
  async logOut(): Promise<void> {
    await signOut(this.auth);
    // Aquí podrías limpiar el localStorage si lo estás usando:
    localStorage.removeItem('user');
  }
}
