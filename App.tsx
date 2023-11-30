// Importing React and necessary components from the project
import React from 'react';  // React import for JSX usage
import MainContainer from './app/MainContainer';  // MainContainer component, typically handles main app layout
import { AuthProvider } from './app/AuthContext';  // AuthProvider component, provides authentication context to the app

// The App component acts as the root component of the application
function App() {
  return (
    // Wrapping MainContainer in AuthProvider to provide authentication context to all child components
    <AuthProvider>
      <MainContainer/>
    </AuthProvider>
  );
}

export default App;  // Exporting App component for use in other parts of the application
