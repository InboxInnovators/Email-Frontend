import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from './msalConfig';
import Login from './components/Login';
import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import './App.css';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  // Check if access token exists in localStorage
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <Routes>
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected home route (EmailList) */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <EmailList /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Protected EmailView route */}
          <Route 
            path="email/:emailId" 
            element={
              isAuthenticated ? <EmailView /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch-all route redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </MsalProvider>
  );
}

export default App;
