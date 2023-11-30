import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChMGlP_F4x0JSOTRDmKlpjOV3IOS4N7i4",
  authDomain: "matchpoint-final.firebaseapp.com",
  projectId: "matchpoint-final",
  storageBucket: "matchpoint-final.appspot.com",
  messagingSenderId: "23549818138",
  appId: "1:23549818138:web:532913e511259276f168a3",
  measurementId: "G-CNLXXFEYWB"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

