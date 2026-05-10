import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// Replace these values with the ones from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCcYKJHAzR8Gfe2kzuePnbsTqHson9JZIA",
  authDomain: "stock-market-ai-cd2d0.firebaseapp.com",
  projectId: "stock-market-ai-cd2d0",
  storageBucket: "stock-market-ai-cd2d0.firebasestorage.app",
  messagingSenderId: "294640373607",
  appId: "1:294640373607:web:ed0ca9a32e6e987e30e9c2",
  measurementId: "G-533Z09CNKE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();