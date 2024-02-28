// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDUW2UZ3CTToegpPi4TxZE7vCQf0Mw8rU",
  authDomain: "locationapp-aa9b0.firebaseapp.com",
  databaseURL: "https://locationapp-aa9b0-default-rtdb.firebaseio.com",
  projectId: "locationapp-aa9b0",
  storageBucket: "locationapp-aa9b0.appspot.com",
  messagingSenderId: "1080987157573",
  appId: "1:1080987157573:web:ffc4cf4f8a6a2e43d1cf2c",
  measurementId: "G-MZR2JS3Y0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//initialise database
export const db = getDatabase(app);