// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTpLYduB5Zt_1oyDblZmrWaJvv1pJ3-_E",
  authDomain: "acadamix-lms.firebaseapp.com",
  projectId: "acadamix-lms",
  storageBucket: "acadamix-lms.appspot.com",
  messagingSenderId: "505269447147",
  appId: "1:505269447147:web:cec6c6458351f48fa551ae",
  measurementId: "G-CBZQPMPYE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services so other files can use them
export const auth = getAuth(app);
export const db = getFirestore(app);