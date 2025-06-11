
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBm1lQD6nF0_ui36KCHZGHS1ugANzVqBp8",
  authDomain: "tastytales-26e0c.firebaseapp.com",
  projectId: "tastytales-26e0c",
  storageBucket: "tastytales-26e0c.firebasestorage.app",
  messagingSenderId: "193657630094",
  appId: "1:193657630094:web:17ab568e89ffa6c74808df",
  measurementId: "G-P4YV3GJ9V2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
