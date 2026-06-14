import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCRG8MOc450t1zroDrE8fmOCPTBtHXYGA",
  authDomain: "mytasksdashboard-89948.firebaseapp.com",
  projectId: "mytasksdashboard-89948",
  storageBucket: "mytasksdashboard-89948.firebasestorage.app",
  messagingSenderId: "1002855011002",
  appId: "1:1002855011002:web:84c76ef9939848f03fa883",
  measurementId: "G-04Q30LRDHM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);