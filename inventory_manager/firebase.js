// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi6nLbAl-mt1Hkr5gpHO-bz8p6PssiBsI",
  authDomain: "inventory-management-74325.firebaseapp.com",
  projectId: "inventory-management-74325",
  storageBucket: "inventory-management-74325.appspot.com",
  messagingSenderId: "926526873406",
  appId: "1:926526873406:web:cc95cb1ec63e575f8a166f",
  measurementId: "G-4VZ9F2EF6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
