import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {
    console.log('Firestore instance:', (firestore as any).firestore);
  }

  async createUser(userData: any): Promise<void> {
    return this.firestore.collection('usuarios').doc(userData.uid).set(userData);
  }

  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('usuarios').valueChanges({ idField: 'uid' });
  }
}
