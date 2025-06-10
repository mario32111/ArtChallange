import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  where,
  getDocs,
  query
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


    async toggleLike2(likeData: Like): Promise<'liked' | 'unliked'> {
    const likeId = `${likeData.postId}_${likeData.usuarioId}`;
    const likeRef = doc(this.firestore, 'likes', likeId);
    const postRef = doc(this.firestore, 'userPosts', likeData.postId); // Asumiendo que 'convocatorias' es tu colección de posts
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

  async getLikesForPost(postId: string): Promise<Like[]> {
  const likesRef = collection(this.firestore, 'likes');
  const q = query(likesRef, where('postId', '==', postId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data() as Like);
}
}
