import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAcx705t0_Vd4Cd1u3OCQkBlr58gxOwaCU",
  authDomain: "wecom-cc348.firebaseapp.com",
  projectId: "wecom-cc348",
  storageBucket: "wecom-cc348.appspot.com",
  messagingSenderId: "548366103484",
  appId: "1:548366103484:web:23c4cc5ae68968b5f3f1b9"
};
// Initialize Firebase
export const firebaseapp = firebase.initializeApp(firebaseConfig);