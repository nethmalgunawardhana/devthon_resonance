// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkFhKfUz5sWLBGIy_kvqhZ-xt0iZXfcQY",
  authDomain: "resonance-28edf.firebaseapp.com",
  projectId: "resonance-28edf",
  storageBucket: "resonance-28edf.firebasestorage.app",
  messagingSenderId: "980274162750",
  appId: "1:980274162750:web:fdd59fb964d9ee65e5f56f",
  measurementId: "G-R50B3K62V6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();