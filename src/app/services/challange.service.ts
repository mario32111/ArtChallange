import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar 'map' de RxJS

@Injectable({
  providedIn: 'root'
})
export class ChallangeService {
  constructor(private firestore: Firestore) { }

  createChallange(challangeData: any): Promise<any> {
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
}
