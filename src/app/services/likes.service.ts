import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from '@angular/fire/firestore';
import { Like } from '../interfaces/post.interfaces';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(private firestore: Firestore) { }

  async toggleLike(likeData: Like): Promise<'liked' | 'unliked'> {
    const likeId = `${likeData.postId}_${likeData.usuarioId}`;
    const likeRef = doc(this.firestore, 'likes', likeId);
    const postRef = doc(this.firestore, 'posts', likeData.postId); // Asumiendo que 'convocatorias' es tu colección de posts
    const existing = await getDoc(likeRef);

    if (existing.exists()) {
      await deleteDoc(likeRef);
      await updateDoc(postRef, {
        likes: arrayRemove(likeData.usuarioId)
      });
      return 'unliked';
    } else {
      likeData.id = likeId;
      await setDoc(likeRef, likeData);
      await updateDoc(postRef, {
        likes: arrayUnion(likeData.usuarioId)
      });
      return 'liked';
    }
  }
}
