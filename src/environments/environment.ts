import { FirebaseOptions } from '@angular/fire/app'

interface Environment {
  production: boolean
  firebase: FirebaseOptions
}

export const environment: Environment = {
  production: true,
  firebase: {
    projectId: 'FIREBASE_PROJECT_ID',
    appId: 'FIREBASE_APP_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
  },
}
