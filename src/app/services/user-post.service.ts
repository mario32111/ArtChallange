import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  Timestamp // Import Timestamp
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserPost } from '../interfaces/post.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserPostsService {
  constructor(private firestore: Firestore) {}

  getAllUserPosts(): Observable<UserPost[]> {
    const postsCollection = collection(this.firestore, 'userPosts');
    return from(getDocs(postsCollection)).pipe(
      map(snapshot =>
        snapshot.docs
          .map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamps to Date objects for fechaPublicacion, creadoEn, actualizadoEn
            const fechaPublicacion = (data['fechaPublicacion'] instanceof Timestamp) ? data['fechaPublicacion'].toDate() : new Date(data['fechaPublicacion']);
            const creadoEn = (data['creadoEn'] instanceof Timestamp) ? data['creadoEn'].toDate() : new Date(data['creadoEn']);
            const actualizadoEn = (data['actualizadoEn'] instanceof Timestamp) ? data['actualizadoEn'].toDate() : new Date(data['actualizadoEn']);

            return {
              ...(data as UserPost),
              id: doc.id, // Optionally add ID
              fechaPublicacion: fechaPublicacion,
              creadoEn: creadoEn,
              actualizadoEn: actualizadoEn
            };
          })
      )
    );
  }

  getUserPostsById(uid: string): Observable<UserPost[]> {
    const postsCollection = collection(this.firestore, 'userPosts');
    const postsQuery = query(postsCollection, where('autorId', '==', uid));
    return from(getDocs(postsQuery)).pipe(
      map(snapshot =>
        snapshot.docs
          .map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamps to Date objects
            const fechaPublicacion = (data['fechaPublicacion'] instanceof Timestamp) ? data['fechaPublicacion'].toDate() : new Date(data['fechaPublicacion']);
            const creadoEn = (data['creadoEn'] instanceof Timestamp) ? data['creadoEn'].toDate() : new Date(data['creadoEn']);
            const actualizadoEn = (data['actualizadoEn'] instanceof Timestamp) ? data['actualizadoEn'].toDate() : new Date(data['actualizadoEn']);

            return {
              ...(data as UserPost),
              id: doc.id,
              fechaPublicacion: fechaPublicacion,
              creadoEn: creadoEn,
              actualizadoEn: actualizadoEn
            };
          })
      )
    );
  }

  // NEW: Get posts by concursoId
  getPostsByConcursoId(concursoId: string): Observable<UserPost[]> {
    const postsCollection = collection(this.firestore, 'userPosts');
    const postsQuery = query(postsCollection, where('concursoId', '==', concursoId));
    return from(getDocs(postsQuery)).pipe(
      map(snapshot =>
        snapshot.docs
          .map(doc => {
            const data = doc.data();
             // Convert Firestore Timestamps to Date objects
            const fechaPublicacion = (data['fechaPublicacion'] instanceof Timestamp) ? data['fechaPublicacion'].toDate() : new Date(data['fechaPublicacion']);
            const creadoEn = (data['creadoEn'] instanceof Timestamp) ? data['creadoEn'].toDate() : new Date(data['creadoEn']);
            const actualizadoEn = (data['actualizadoEn'] instanceof Timestamp) ? data['actualizadoEn'].toDate() : new Date(data['actualizadoEn']);

            return {
              ...(data as UserPost),
              id: doc.id,
              fechaPublicacion: fechaPublicacion,
              creadoEn: creadoEn,
              actualizadoEn: actualizadoEn
            };
          })
      )
    );
  }


  createUserPost(postData: UserPost): Promise<void> {
    const postId = doc(collection(this.firestore, 'userPosts')).id;
    const postDoc = doc(this.firestore, 'userPosts', postId);
    // Ensure Date objects are converted to Firestore Timestamps upon saving
    const dataToSave = {
      ...postData,
      fechaPublicacion: Timestamp.fromDate(postData.fechaPublicacion),
      creadoEn: Timestamp.fromDate(postData.creadoEn),
      actualizadoEn: Timestamp.fromDate(postData.actualizadoEn)
    };
    return setDoc(postDoc, dataToSave);
  }
}