import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar 'map' de RxJS

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  createUser(userData: any): Promise<void> {
    const userDoc = doc(this.firestore, 'usuarios', userData.uid);
    return setDoc(userDoc, userData);
  }

  getAllUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'usuarios');
    return from(getDocs(usersCollection)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id, // Aquí agregamos el campo uid de forma explícita
          ...doc.data()
        }));
      })
    );
  }

  /*
  //?El otro metodo de getAllUsers, por si se requiere
    getAllUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'usuarios');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<any[]>;
  }
   */
}
