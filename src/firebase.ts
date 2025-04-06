import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBxqwRjrvRCF8UKDJvULapHVG4-AEdxxe8",
  authDomain: "resonance-8a5f1.firebaseapp.com",
  projectId: "resonance-8a5f1",
  storageBucket: "resonance-8a5f1.firebasestorage.app",
  messagingSenderId: "185678832302",
  appId: "1:185678832302:web:342484c29405b63b74833f"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

