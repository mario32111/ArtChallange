import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar 'map' de RxJS

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private firestore: Firestore) { }


  uploadProfile(profileData: any): Promise<void> {
    const profileDoc = doc(this.firestore, 'profiles', profileData.uid);
    return setDoc(profileDoc, profileData);
  }

  getProfileByUid(uid: string): Observable<any> {
    const profilesCollection = collection(this.firestore, 'profiles');
    const profilesQuery = query(profilesCollection, where('uid', '==', uid)); // Buscamos el campo 'uid' con el valor proporcionado
    return from(getDocs(profilesQuery)).pipe(
      map((querySnapshot) => {
        const profileDocs = querySnapshot.docs.map((doc) => ({
          id: doc.id, // ID del documento
          ...doc.data() // Los datos del usuario
        }));

        if (profileDocs.length > 0) {
          return profileDocs[0]; // Devuelve el primer usuario encontrado
        } else {
          throw new Error('Usuario no encontrado');
        }
      })
    );
  }

  // MODIFICADO: Para buscar usuarios cuyo 'username' empieza por el valor dado
  getUsersByUsername(usernamePrefix: string): Observable<any[]> {
    const profilesCollection = collection(this.firestore, 'users');
    // Asegúrate de que tu campo en Firestore se llame 'username'
    // Para búsquedas "empieza por", necesitas un índice en Firestore para el campo 'username'.
    // Si no lo tienes, Firebase te dará un enlace para crearlo en la consola.
    const profilesQuery = query(
      profilesCollection,
      where('displayName', '>=', usernamePrefix),
      where('displayName', '<=', usernamePrefix + '\uf8ff') // '\uf8ff' es un carácter Unicode muy alto para el final del rango
    );
    return from(getDocs(profilesQuery)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      })
    );
  }

}
