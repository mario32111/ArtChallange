// auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root' // Ensures singleton service
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  async loginWithGoogle() {
    try {
      const result = await this.afAuth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      );
      return result.user;
    } catch (error) {
      throw error; // Re-throw for component handling
    }
  }
}
