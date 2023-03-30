// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Import the necessary Firebase modules
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAp0fM95BwAQusWPuf5dRMHwcxCbT1Iovw",
  authDomain: "blog-c94fb.firebaseapp.com",
  projectId: "blog-c94fb",
  storageBucket: "blog-c94fb.appspot.com",
  messagingSenderId: "991476985796",
  appId: "1:991476985796:web:8a38adc6f1b2ead7d73e91",
  measurementId: "G-Y7LTPS11WJ"
};
// Initialize Firebase with your app configuration
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Initialize the Firebase modules you need
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export the initialized Firebase modules
export { db, storage, auth };


