import React, { useEffect, useState } from "react";
import { useMsal, MsalProvider } from "@azure/msal-react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { loginRequest } from "./auth-config";
import EmailList from "./components/EmailList";
import EmailView from "./components/EmailView";
import useStore from "./useStore";
import PrivateRoute from "./components/routing/PrivateRoute";
import ProfileMenu from "./components/ProfileMenu";
import AutomationRulesPage from "./components/AutomationRulesPage";
import { Toaster } from 'sonner';
import Icon from '../src/EI-Logo.png'
import RulesPage from "./components/RulesPage";

const WrappedView = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const setAccessToken = useStore((state) => state.setAccessToken);
  
  const navigate=useNavigate();

  const fetchAccessToken = async () => {
    if (activeAccount) {
      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: activeAccount,
        });
        console.log("Access Token:", response.accessToken);
        setAccessToken(response.accessToken);
      } catch (error) {
        console.error("Token fetch error:", error);
        instance.acquireTokenRedirect(loginRequest).catch((loginError) => {
          console.error("Interactive login error:", loginError);
        });
      }
    }
  };

  useEffect(() => {
    if (!activeAccount) {
      instance
        .handleRedirectPromise()
        .then((response) => {
          if (response && response.account) {
            instance.setActiveAccount(response.account);
          }
        })
        .catch((error) => console.error("Redirect error:", error));
    }
  }, [activeAccount, instance]);

  useEffect(() => {
    fetchAccessToken();
  }, [activeAccount]);

  const handleLogin = () => {
    instance
      .loginRedirect(loginRequest)
      .catch((error) => console.error("Login error:", error));
  };

  const handleSignOut = () => {
    instance.logoutRedirect();
  };

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const fetchUserProfile = async () => {
    if (activeAccount) {
      const accessToken = useStore.getState().accessToken;
      try {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setUserName(data.displayName);
        setUserEmail(data.mail || data.userPrincipalName);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [activeAccount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {activeAccount && <ProfileMenu userName={userName} userEmail={userEmail} onSignOut={handleSignOut} />}
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto w-[120px] h-[120px] w-auto"
            src={Icon}
            alt="Smart Email"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          {activeAccount ? (
            navigate('/emails')
          ) : (
            <button
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Login with Microsoft
            </button>
          )}
        </div>
      </div>
      <Toaster position="top-center" richColors/>
    </div>
  );
};


const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <Router>
        <Routes>
          <Route path="/" element={<WrappedView />} />
          <Route element={<PrivateRoute />}>
            <Route path="/emails" element={<EmailList />} />
            <Route path="/email/:id" element={<EmailView />} />
          </Route>
          <Route path="/rules" element={<RulesPage/>}/>
        </Routes>
      </Router>
      <Toaster position="top-center" richColors/>
    </MsalProvider>
  );
};

export default App;