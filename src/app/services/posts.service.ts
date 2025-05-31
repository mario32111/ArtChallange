import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar 'map' de RxJS4
import { ConvovatoriaPost } from '../interfaces/post.interfaces'; // Asegúrate de que esta ruta sea correcta y que el archivo exista
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private firestore: Firestore) { }

  getAllPosts(): Observable<any[]> {
    const postsCollection = collection(this.firestore, 'posts');
    return from(getDocs(postsCollection)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id, // Aquí agregamos el campo uid de forma explícita
          ...doc.data()
        }));
      })
    );
  }

  getUserPosts(uid: string): Observable<any[]> {
    const postsCollection = collection(this.firestore, 'posts');
    const postsQuery = query(postsCollection, where('uid', '==', uid)); // Buscamos el campo 'uid' con el valor proporcionado
    return from(getDocs(postsQuery)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id, // ID del documento
          ...doc.data() // Los datos del post
        }));
      })
    );
  }


  createConvocatoriaPost(postData: ConvovatoriaPost): Promise<void> {
    const postDoc = doc(this.firestore, 'posts', postData.uid);
    return setDoc(postDoc, postData);
  }

  createParticipationPost(postData: any): Promise<void> {
    const postDoc = doc(this.firestore, 'posts', postData.uid);
    return setDoc(postDoc, postData);
  }
}
