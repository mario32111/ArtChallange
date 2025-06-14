import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar 'map' de RxJS

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) { }

  createUser(userData: any): Promise<void> {
    const userDoc = doc(this.firestore, 'users', userData.uid);
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


  // Obtener un usuario por su UID
  getUserByUid(uid: string): Observable<any> {
    const usersCollection = collection(this.firestore, 'users');
    const usersQuery = query(usersCollection, where('uid', '==', uid)); // Buscamos el campo 'uid' con el valor proporcionado
    return from(getDocs(usersQuery)).pipe(
      map((querySnapshot) => {
        const userDocs = querySnapshot.docs.map((doc) => ({
          id: doc.id, // ID del documento
          ...doc.data() // Los datos del usuario
        }));

        if (userDocs.length > 0) {
          return userDocs[0]; // Devuelve el primer usuario encontrado
        } else {
          throw new Error('Usuario no encontrado');
        }
      })
    );
  }

  //Obtiene los concursos del usuario
  getUserContests(uid: string): Observable<string[]> {
  const userContestsRef = collection(this.firestore, 'userContests');
  const q = query(userContestsRef, where('uid', '==', uid));

  return from(getDocs(q)).pipe(
    map(snapshot => snapshot.docs.map(doc => doc.data()['concursoId']))
  );
}


  /*
  //*El otro metodo de getAllUsers, por si se requiere
    getAllUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'usuarios');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<any[]>;
  }
   */
}
