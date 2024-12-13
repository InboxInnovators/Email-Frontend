// src/msalConfig.js
import {LogLevel}  from '@azure/msal-browser';


export const msalConfig={
  auth:
  {
    clientId:'88ae7529-44dc-4b77-9773-a23cc03283c5',
    authority:'https://login.microsoftonline.com/organizations',
    redirectUri:'/',
    postLogoutRedirectUri:'/',
    navigateToLoginRequestUri:false,
  },
  cache:{
    cacheLocation:'sessionStorage',
    storeAuthStateInCookie:false
  },
  system: {
    loggerOptions: {
        loggerCallback: (
            level,
            message,
            containsPii
        )=>{
            if (containsPii) {
                return;
            }
            switch (level) {
                case LogLevel.Error:
                    console.error(message);
                    return;
                case LogLevel.Info:
                    console.info(message);
                    return;
                case LogLevel.Verbose:
                    console.debug(message);
                    return;
                case LogLevel.Warning:
                    console.warn(message);
                    return;
                default:
                  return;
            }
          },
        },
      },
}

export const  loginRequest={
  scopes:['user.read'],
}