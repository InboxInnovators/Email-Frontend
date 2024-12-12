import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication, LogLevel } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from './App';
import { msalConfig, loginRequest } from './msalConfig';
import './index.css';
import reportWebVitals from './reportWebVitals';

const msalInstance = new PublicClientApplication(msalConfig);

const renderApp = async () => {
  try {
    // Initialize MSAL instance
    await msalInstance.initialize();

    // Handle redirect promise with more detailed error handling
    const response = await msalInstance.handleRedirectPromise()
      .catch((error) => {
        console.error("Detailed Redirect Error:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
          errorCode: error.errorCode,
          errorMessage: error.errorMessage
        });
        return null;
      });

    if (response) {
      console.log("Full redirect response:", response);
      
      const account = response.account;
      
      if (account) {
        // Set active account
        msalInstance.setActiveAccount(account);

        try {
          // Acquire token silently
          const tokenResponse = await msalInstance.acquireTokenSilent({
            scopes: loginRequest.scopes,
            account: account
          });

          console.log("Token Response:", tokenResponse);

          // Store tokens in localStorage
          if (tokenResponse.accessToken) {
            localStorage.setItem('accessToken', tokenResponse.accessToken);
            localStorage.setItem('account', JSON.stringify(account));
            console.log("Tokens and account stored successfully");
          }
        } catch (silentTokenError) {
          console.error("Silent Token Acquisition Error:", silentTokenError);
        }

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // Render the React application
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("MSAL Initialization Error:", error);
  }
};

renderApp();

reportWebVitals();
