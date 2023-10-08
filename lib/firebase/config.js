// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjvo_zUSs0Ls8VPMp2Itx8yiyTKkUggzA",
  authDomain: "expense-tracker-109de.firebaseapp.com",
  projectId: "expense-tracker-109de",
  storageBucket: "expense-tracker-109de.appspot.com",
  messagingSenderId: "278018013866",
  appId: "1:278018013866:web:831fef59e2ee2926746ed3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export {app, db, auth, provider}