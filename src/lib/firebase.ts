import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnyAl3WvcFVc5X0Ax_ILYI3roP1aslxw4",
  authDomain: "karikalan-6f48f.firebaseapp.com",
  projectId: "karikalan-6f48f",
  storageBucket: "karikalan-6f48f.firebasestorage.app",
  messagingSenderId: "1036262869411",
  appId: "1:1036262869411:web:d687e5c12481972b2b3216",
  measurementId: "G-98FR006KQ0",
  databaseURL: "https://karikalan-6f48f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Connect to emulator in development if needed
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true") {
  const { connectDatabaseEmulator } = require("firebase/database");
  connectDatabaseEmulator(db, "127.0.0.1", 9000);
}
