"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
// Import types for the Firebase services.
import { type FirebaseApp } from "firebase/app";
import { type Analytics } from "firebase/analytics";
import { type Firestore } from "firebase/firestore";
import { type Auth, onAuthStateChanged, type User, signInWithCustomToken, signInAnonymously } from "firebase/auth";

// ✅ Import initialized Firebase services from your lib
import { app, analytics, db, auth } from "../../lib/firebase";

// Declare global variables provided by the Canvas environment.
declare var __initial_auth_token: string | undefined;

// Define the type for our Firebase services object, including the possibility of null or undefined.
interface FirebaseServices {
  app: FirebaseApp | null;
  analytics: Analytics | undefined;
  auth: Auth | undefined;
  db: Firestore | undefined;
  currentUser: User | null;
  loading: boolean;
}

// Create the context with a default value that matches the interface.
const FirebaseContext = createContext<FirebaseServices>({
  app,
  analytics: undefined,
  auth: undefined,
  db: undefined,
  currentUser: null,
  loading: true,
});

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export default function FirebaseProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // This effect handles the initial authentication.
  useEffect(() => {
    const authUser = async () => {
      if (auth) {
        try {
          if (typeof __initial_auth_token !== 'undefined') {
            console.log("Signing in with custom token.");
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            console.log("Signing in anonymously.");
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Authentication failed:", error);
        }
      }
    };
    authUser();
  }, []);

  // This effect listens for auth state changes.
  useEffect(() => {
    if (auth) {
      console.log("Setting up auth state listener...");
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. Current user:", user);
        setCurrentUser(user);
        setLoading(false);
      });

      return () => {
        console.log("Cleaning up auth state listener.");
        unsubscribe();
      };
    } else {
      console.error("Firebase Auth service is not available.");
      setLoading(false);
    }
  }, []);

  const contextValue: FirebaseServices = {
    app,
    analytics,
    auth,
    db,
    currentUser,
    loading,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}
