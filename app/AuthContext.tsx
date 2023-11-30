// Importing necessary libraries and components
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';

// Create a context for authentication state
const AuthContext = createContext<any>(null);

// Custom hook for accessing the authentication context
export const useAuth = () => useContext(AuthContext);

// Component to provide authentication state to its children
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setCurrentUser(user); 
      setLoading(false);    
    });

    return unsubscribe;
  }, []);

  // Value object containing the current user and loading state
  const value = { currentUser, loading };

  // Render children components only when not loading
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
