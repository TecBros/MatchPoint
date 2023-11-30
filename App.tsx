import React, { } from 'react';
import MainContainer from './app/MainContainer';
import { AuthProvider } from './app/AuthContext';


function App(){
  return(
    <AuthProvider>
    <MainContainer/>
    </AuthProvider>
  );
}

export default App;
