import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, arrayUnion, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Comentario } from '../interfaces/post.interfaces'; // Ajusta la ruta según sea necesario
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
}
