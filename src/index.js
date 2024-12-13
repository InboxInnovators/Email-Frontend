import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Import your CSS if needed
import App from "./App"; // Import the main App component
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./auth-config";

const msalInstance = new PublicClientApplication(msalConfig);

// Add an event callback to handle login success events
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account); // Set the active account after successful login
  }
});

// Ensure the active account is set if not already
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App instance={msalInstance} />);
