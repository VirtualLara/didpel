import firebase from 'firebase/app';

var firebaseConfig = {
  apiKey: "AIzaSyCIQyvtQZh8lLkOSCOxD9WXQDPAK0CX2t0",
  authDomain: "appmy-4f532.firebaseapp.com",
  projectId: "appmy-4f532",
  storageBucket: "appmy-4f532.appspot.com",
  messagingSenderId: "613272092933",
  appId: "1:613272092933:web:95e3efed0727a47076376c"
};

// Initialize Firebase
export const firebaseapp = firebase.initializeApp(firebaseConfig);