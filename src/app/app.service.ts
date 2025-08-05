import { Injectable, inject } from '@angular/core'
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { Observable, catchError, map, of } from 'rxjs'

export interface Certificate {
  date: string
  category: string
  image: string
  id: string
}

interface Response {
  data: Certificate[]
  loaded: boolean
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  firestore = inject(Firestore)

  getCertificates(): Observable<Response> {
    const collectionRef = collection(this.firestore, 'certifications')
    const data$ = collectionData(collectionRef, {
      idField: 'id',
    }) as Observable<Certificate[]>
    return data$.pipe(
      map((data) => ({ data, loaded: true })),
      catchError(() => of({ data: [], loaded: false }))
    )
  }
}
