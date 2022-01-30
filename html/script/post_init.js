// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpoEOgyGHiSt5w07sh_KkSg852Bw34Qxc",
  authDomain: "ood-blog.firebaseapp.com",
  projectId: "ood-blog",
  storageBucket: "ood-blog.appspot.com",
  messagingSenderId: "732775523621",
  appId: "1:732775523621:web:b134125ad811e63aef66cc",
  measurementId: "G-V2MZY72Y23"
};
