import { FirebaseOptions } from '@angular/fire/app'

interface Environment {
  production: boolean
  firebase: FirebaseOptions
}

export const environment: Environment = {
  production: true,
  firebase: {
    projectId: 'some_value',
    appId: 'some_value',
    storageBucket: 'some_value',
    apiKey: 'some_value',
    authDomain: 'some_value',
    messagingSenderId: 'some_value',
  },
}
