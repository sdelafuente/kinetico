import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {
  public juegosListRef: firebase.firestore.CollectionReference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.juegosListRef = firebase
          .firestore()
          .collection(`/userJuegos/${user.uid}/juegos`);
      }
    });
  }

  crearJuego(
    juegoTiempo: string,
    juegoFecha: string
  ): Promise<firebase.firestore.DocumentReference> {
    return this.juegosListRef.add({
      tiempo: juegoTiempo,
      fecha: juegoFecha,
    });
  }

  getJuegosList(): firebase.firestore.CollectionReference {
    return this.juegosListRef;
  }

  getJuegosDetail(juegoId: string): firebase.firestore.DocumentReference {
    return this.juegosListRef.doc(juegoId);
  }
}
