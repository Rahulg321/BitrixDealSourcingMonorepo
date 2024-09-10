// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYAptWHwAYC4GoLpO-R_zMMxscKzwseQo",
  authDomain: "deal-sourcing-scraper.firebaseapp.com",
  projectId: "deal-sourcing-scraper",
  storageBucket: "deal-sourcing-scraper.appspot.com",
  messagingSenderId: "54092164401",
  appId: "1:54092164401:web:eee4dfb062cf5c04df5410",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
