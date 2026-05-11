import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCxlfhM1myFthny0PpxeIqOwx2MBe-KZoY",

  authDomain: "cse3mad-assignment4.firebaseapp.com",

  projectId: "cse3mad-assignment4",

  storageBucket: "cse3mad-assignment4.firebasestorage.app",

  messagingSenderId: "5655315419",

  appId: "1:5655315419:web:a61eb16277fd3fbed95dfe",

  measurementId: "G-M5VS701WPS",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
