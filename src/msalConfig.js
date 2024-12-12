import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "88ae7529-44dc-4b77-9773-a23cc03283c5",
    authority: `https://login.microsoftonline.com/d25e697e-9987-4146-87ba-800be6fd457c`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false
  }
};

export const loginRequest = {
  scopes: [
    "openid", 
    "profile", 
    "email", 
    "User.Read"
  ],
  redirectUri: window.location.origin,
  prompt: 'login'
}; 