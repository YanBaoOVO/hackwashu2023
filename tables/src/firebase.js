// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu0hMEu0C4NV0YoD_duB2AdQi8fJz1i7o",
  authDomain: "tables-91a67.firebaseapp.com",
  projectId: "tables-91a67",
  storageBucket: "tables-91a67.appspot.com",
  messagingSenderId: "926536433720",
  appId: "1:926536433720:web:39153a47923bfad007e6cd",
  measurementId: "G-ECFMQC34MK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Pass the Firebase app instance as an argument to getFirestore()

export {db};