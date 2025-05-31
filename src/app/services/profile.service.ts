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
}
