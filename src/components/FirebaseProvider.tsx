// components/FirebaseProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth, onAuthStateChanged, type User } from "firebase/auth";

// Define the type for our Firebase services object
interface FirebaseServices {
  app: FirebaseApp;
  analytics: Analytics;
  auth: Auth;
  db: Firestore;
  currentUser: User | null;
  loading: boolean;
}

// Create a context to hold the Firebase services, typed to our interface
const FirebaseContext = createContext<FirebaseServices | null>(null);

// Custom hook to use the Firebase services in any component
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

// The Firebase Provider component that will initialize the app and provide services
export default function FirebaseProvider({ children }: { children: ReactNode }) {
  const [firebaseServices, setFirebaseServices] = useState<Omit<FirebaseServices, "currentUser" | "loading"> | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Effect to initialize Firebase services
  useEffect(() => {
    if (!firebaseServices) {
      try {
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        };

        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        const db = getFirestore(app);

        setFirebaseServices({ app, analytics, auth, db });
      } catch (error) {
        console.error("Firebase initialization failed:", error);
      }
    }
  }, [firebaseServices]);

  // Effect to handle authentication state changes
  useEffect(() => {
    if (firebaseServices?.auth) {
      const unsubscribe = onAuthStateChanged(firebaseServices.auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [firebaseServices?.auth]);

  // Provide the services and user state to the rest of the app via context
  const contextValue = firebaseServices ? { ...firebaseServices, currentUser, loading } : null;

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}
