import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar 'map' de RxJS
import { getDoc } from '@angular/fire/firestore';
import { ChallangeDocument } from '../interfaces/challange.model';


@Injectable({
  providedIn: 'root'
})
export class ChallangeService {
  constructor(private firestore: Firestore) { }

  createChallange(challangeData: ChallangeDocument): Promise<any> {
    const challangesCollection = collection(this.firestore, 'challanges');
    return addDoc(challangesCollection, challangeData);
  }

  getAllChallanges(): Observable<any[]> {
    const challangesCollection = collection(this.firestore, 'challanges');
    return from(getDocs(challangesCollection)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id, // Aquí agregamos el campo uid de forma explícita
          ...doc.data()
        }));
      })
    );
  }

  //Buscar concursos por ID
  getChallangeById(challangeId: string): Observable<any> {
  const challangeDoc = doc(this.firestore, 'challanges', challangeId);
  return from(getDoc(challangeDoc)).pipe(
    map(docSnap => {
      if (!docSnap.exists()) throw new Error('Challange not found');
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    })
  );
}

//registrar usuairo a concurso
signUpUserToChallange(uid: string, challangeId: string): Promise<any> {
  const userChallangesCollection = collection(this.firestore, 'userChallanges');
  return addDoc(userChallangesCollection, {
    uid,
    challangeId,
    signedAt: new Date().toISOString()
  });
}

//en caso de que el usuario ya esta inscrito
isUserSignedUp(uid: string, challangeId: string): Observable<boolean> {
  const userChallangesRef = collection(this.firestore, 'userChallanges');
  const q = query(userChallangesRef, where('uid', '==', uid), where('challangeId', '==', challangeId));

  return from(getDocs(q)).pipe(
    map(snapshot => !snapshot.empty)
  );
}

// Concurso de usuario
getUserChallanges(uid: string): Observable<string[]> {
  const userChallangesRef = collection(this.firestore, 'userChallanges');
  const q = query(userChallangesRef, where('uid', '==', uid));
  return from(getDocs(q)).pipe(
    map(snapshot => snapshot.docs.map(doc => doc.data()['challangeId']))
  );
}

}
