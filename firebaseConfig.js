import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Senin projenin gizli şifreleri
const firebaseConfig = {
  apiKey: "KALDIRILDI_FIREBASE_API_KEY",
  authDomain: "maas-primtakip.firebaseapp.com",
  projectId: "maas-primtakip",
  storageBucket: "maas-primtakip.firebasestorage.app",
  messagingSenderId: "589781739238",
  appId: "1:589781739238:web:0512b7d1b174550ae87d27",
  measurementId: "G-40MYEFZ2HC"
};

// Firebase'i ve Firestore veritabanını başlatıyoruz
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);