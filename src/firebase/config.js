import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhMIjvj_e8ibH4Ahw8tTTJTRm-TAWNVSM",
  authDomain: "mern-todo-app-12555.firebaseapp.com",
  projectId: "mern-todo-app-12555",
  storageBucket: "mern-todo-app-12555.appspot.com", 
  messagingSenderId: "403843578869",
  appId: "1:403843578869:web:2055441b4185bd7b47bebc",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
