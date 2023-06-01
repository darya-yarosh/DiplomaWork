
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
//import { getFirestore } from "@firebase-admin/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const REACT_APP_apiKey = "AIzaSyCnolQc8U0vWHLKoe3AR0GEw-lU2-GEsnI";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: REACT_APP_apiKey,
  authDomain: "test1-447c0.firebaseapp.com",
  projectId: "test1-447c0",
  storageBucket: "test1-447c0.appspot.com",
  messagingSenderId: "833062525036",
  appId: "1:833062525036:web:9afba40e6c7afa71d22049"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);