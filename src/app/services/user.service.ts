import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {} // Usa Firestore de Firebase v9

  createUser(userData: any): Promise<void> {
    const userDoc = doc(this.firestore, 'usuarios', userData.uid);
    return setDoc(userDoc, userData);
  }

  getAllUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'usuarios');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<any[]>;
  }
}
