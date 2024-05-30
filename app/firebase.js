import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/firestore';


// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyCRAM2xLdNfE52e61fs78Dr1fT1iIg8pTU",
  authDomain: "dailyquo-c40ee.firebaseapp.com",
  projectId: "dailyquo-c40ee",
  storageBucket: "dailyquo-c40ee.appspot.com",
  messagingSenderId: "363183579943",
  appId: "1:363183579943:web:a9d352e50db5eb8ca5ff02",
  measurementId: "G-04JB0F0MNS"
};

// Firebase uygulamasını başlatma
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  }


const auth = firebase.auth();
const db = firebase.firestore();

export { auth };
export { db };
export {firebase};


