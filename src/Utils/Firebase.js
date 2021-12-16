import firebase from 'firebase/app';
//import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCkgct0-_sPc8Iz0dngFqWvKFGUz5NqynA",
  authDomain: "didpel-50fe0.firebaseapp.com",
  projectId: "didpel-50fe0",
  storageBucket: "didpel-50fe0.appspot.com",
  messagingSenderId: "44353216913",
  appId: "1:44353216913:web:45614dc3b9d0e2f0a73a30"
};

// Initialize Firebase
export const firebaseapp = firebase.initializeApp(firebaseConfig);
//export const firebaseapp = initializeApp(firebaseConfig);