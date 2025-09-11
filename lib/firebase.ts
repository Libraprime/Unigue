import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAZdGSMmFUOYxLN2p0SWHTjNffOxSvykNU",
//   authDomain: "unique-736db.firebaseapp.com",
//   projectId: "unique-736db",
//   storageBucket: "unique-736db.firebasestorage.app",
//   messagingSenderId: "920833249816",
//   appId: "1:920833249816:web:6bfc3ed954ac478ea9a96d",
//   measurementId: "G-Q8B5JNZZ1D"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services conditionally on the client-side
let analytics;
let db;
let auth;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  // On the server, we only need auth
  auth = getAuth(app);
}

// Export the initialized services
export { app, analytics, db, auth };
