import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDwGM8gS4fC-7MMS8GLhX51xqagI3qZZl8",
	authDomain: "todo-687dd.firebaseapp.com",
	projectId: "todo-687dd",
	storageBucket: "todo-687dd.appspot.com",
	messagingSenderId: "70440730796",
	appId: "1:70440730796:web:eea74fb6da4728a0325f09",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();