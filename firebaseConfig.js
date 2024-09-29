import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAsUXiIQzksZVRxAXhN9Nd7epx8YhNPwqk",
  authDomain: "todo-aba99.firebaseapp.com",
  projectId: "todo-aba99",
  storageBucket: "todo-aba99.appspot.com",
  messagingSenderId: "23633572951",
  appId: "1:23633572951:web:6d0ff7358cde60cd281f12",
  measurementId: "G-Q01SX9K889"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
