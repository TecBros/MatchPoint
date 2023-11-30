import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';

// Define and initialize state variables
const AuthContext = createContext<any>(null);


// Hook for accessing the authentication context
export const useAuth = () => useContext(AuthContext);

// Provides authentication state to child components
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setCurrentUser(user); // Update user state
      setLoading(false);    // Update loading state
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Authentication context value
  const value = { currentUser, loading };

  // Render children when not loading
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
