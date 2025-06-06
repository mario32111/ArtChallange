import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, arrayUnion, getDoc, query, where, getDocs, deleteDoc, arrayRemove } from '@angular/fire/firestore';
import { Comentario, CommentLike } from '../interfaces/post.interfaces'; // Ajusta la ruta según sea necesario
import { Observable, from } from 'rxjs'; // Importamos 'from' y 'Observable'
import { map } from 'rxjs/operators'; // Importamos 'map'

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private firestore: Firestore) { }

  /**
   * Añade un nuevo comentario a un post específico y actualiza el array de comentarios del post.
   * @param comentarioData Los datos del comentario a ser añadidos.
   * @returns Una Promesa que resuelve con el ID del comentario recién creado.
   */
  async addCommentToPost(comentarioData: Comentario): Promise<string> {
    // 1. Añadir el comentario a una colección 'comments'
    const commentsCollection = collection(this.firestore, 'comments');
    const docRef = await addDoc(commentsCollection, {
      ...comentarioData,
      fecha: comentarioData.fecha || new Date() // Asegura que la fecha se establezca si no se proporciona
    });

    // 2. Actualizar el documento del post correspondiente con el nuevo comentario
    const postId = comentarioData.postId;
    const postRef = doc(this.firestore, 'posts', postId);

    // Tu interfaz ConvovatoriaPost espera el objeto Comentario completo en el array 'comentarios'.
    // Así que, para que coincida con tu definición, añadiremos el objeto completo.
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      await updateDoc(postRef, {
        comentarios: arrayUnion({
          id: docRef.id,
          usuarioId: comentarioData.usuarioId,
          nombreUsuario: comentarioData.nombreUsuario,
          contenido: comentarioData.contenido,
          fecha: comentarioData.fecha || new Date()
        } as Comentario) // Casteamos a Comentario para que coincida con la interfaz
      });
    } else {
      // Manejar el caso en que el post no exista (ej. lanzar un error o registrar una advertencia)
      console.warn(`No se encontró el post con ID ${postId}. El comentario fue añadido pero el post no fue actualizado.`);
    }

    return docRef.id;
  }

  /**
   * Obtiene todos los comentarios para una publicación específica.
   * @param postId El ID de la publicación de la que se desean obtener los comentarios.
   * @returns Un Observable que emite un array de objetos Comentario.
   */
  getCommentsForPost(postId: string): Observable<Comentario[]> {
    const commentsCollectionRef = collection(this.firestore, 'comments');
    const q = query(commentsCollectionRef, where('postId', '==', postId));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        const comments = snapshot.docs.map(doc => {
          const data = doc.data();
          // === ASEGURAR CONVERSIÓN DE FIRESTORE TIMESTAMP A OBJETO DATE ===
          let fechaConvertida: Date;
          if (data['fecha'] && typeof data['fecha'].toDate === 'function') {
            // Es un Firestore Timestamp, conviértelo a Date
            fechaConvertida = data['fecha'].toDate();
          } else if (data['fecha'] instanceof Date) {
            // Ya es un objeto Date (esto podría pasar si se añadió localmente sin guardar)
            fechaConvertida = data['fecha'];
          } else {
            // Intentar convertir de cualquier otra cosa (ej. string de fecha) o usar fecha actual
            fechaConvertida = new Date(data['fecha'] || null);
            if (isNaN(fechaConvertida.getTime())) { // Si la conversión falló
              fechaConvertida = new Date(); // Usar la fecha actual como fallback
            }
          }

          return {
            id: doc.id, // El ID del documento de Firestore
            ...data,
            fecha: fechaConvertida // Asigna la fecha convertida
          } as Comentario;
        });
        console.log(`CommentsService: Se encontraron ${comments.length} comentarios para postId ${postId}.`); // DEPURACIÓN
        return comments;
      })
    );
  }




    /**
   * Obtiene los likes para un comentario específico.
   * @param commentId El ID del comentario.
   * @returns Un array de CommentLike.
   */
  async getLikesForComment(commentId: string): Promise<CommentLike[]> {
    const likesCollectionRef = collection(this.firestore, 'commentLikes');
    const q = query(likesCollectionRef, where('commentId', '==', commentId));
    const snapshot = await getDocs(q);

    const likes = snapshot.docs.map(doc => {
      const data = doc.data();
      let fechaConvertida: Date;
      if (data['fecha'] && typeof data['fecha'].toDate === 'function') {
        fechaConvertida = data['fecha'].toDate();
      } else {
        fechaConvertida = new Date(data['fecha'] || null);
        if (isNaN(fechaConvertida.getTime())) {
          fechaConvertida = new Date();
        }
      }
      return {
        id: doc.id,
        ...data,
        fecha: fechaConvertida
      } as CommentLike;
    });
    console.log(`CommentLikesService: Se encontraron ${likes.length} likes para el comentario ${commentId}.`);
    return likes;
  }

  /**
   * Alterna el estado de like de un comentario (añadir/eliminar like).
   * También actualiza el array de likes dentro del documento del comentario en Firestore.
   * @param likeData Datos del like (usuarioId, commentId, nombreUsuario).
   * @returns 'liked' si se añadió, 'unliked' si se eliminó.
   */
  async toggleCommentLike(likeData: { usuarioId: string; commentId: string; nombreUsuario: string }): Promise<'liked' | 'unliked'> {
    const likesCollectionRef = collection(this.firestore, 'commentLikes');
    const q = query(likesCollectionRef,
      where('commentId', '==', likeData.commentId),
      where('usuarioId', '==', likeData.usuarioId)
    );
    const snapshot = await getDocs(q);

    const commentRef = doc(this.firestore, 'comments', likeData.commentId);

    if (snapshot.empty) {
      // No existe el like, lo añadimos
      const newLike: CommentLike = {
        usuarioId: likeData.usuarioId,
        commentId: likeData.commentId,
        nombreUsuario: likeData.nombreUsuario,
        fecha: new Date()
      };
      const docRef = await addDoc(likesCollectionRef, newLike);

      // Actualizar el array de likes en el documento del comentario
      await updateDoc(commentRef, {
        likes: arrayUnion({
          id: docRef.id,
          usuarioId: newLike.usuarioId,
          nombreUsuario: newLike.nombreUsuario,
          commentId: newLike.commentId,
          fecha: newLike.fecha // Guardar la fecha como Timestamp en el array también
        })
      });
      return 'liked';
    } else {
      // El like existe, lo eliminamos
      const likeDoc = snapshot.docs[0];
      await deleteDoc(doc(this.firestore, 'commentLikes', likeDoc.id));

      // Actualizar el array de likes en el documento del comentario
      await updateDoc(commentRef, {
        likes: arrayRemove({
          id: likeDoc.id, // Es importante usar el ID original del like para arrayRemove
          usuarioId: likeData.usuarioId,
          nombreUsuario: likeData.nombreUsuario,
          commentId: likeData.commentId,
          fecha: likeDoc.data()['fecha'] // Usar la fecha original del documento para arrayRemove
        })
      });
      return 'unliked';
    }
  }
}
