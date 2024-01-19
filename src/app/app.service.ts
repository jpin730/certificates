import { Injectable, inject } from '@angular/core'
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { Observable } from 'rxjs'

export interface Certificate {
  date: string
  category: string
  image: string
  id: string
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  firestore = inject(Firestore)

  constructor() {}

  getCertificates(): Observable<Certificate[]> {
    const collectionRef = collection(this.firestore, 'certifications')
    return collectionData(collectionRef, { idField: 'id' }) as Observable<
      Certificate[]
    >
  }
}
