import { FirebaseOptions } from '@angular/fire/app'

interface Environment {
  production: boolean
  firebase: FirebaseOptions
}

export const environment: Environment = {
  production: true,
  firebase: {
    projectId: 'projectId',
    appId: 'appId',
    storageBucket: 'storageBucket',
    apiKey: 'apiKey',
    authDomain: 'authDomain',
    messagingSenderId: 'messagingSenderId',
  },
}
