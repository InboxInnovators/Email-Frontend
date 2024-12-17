import React, { useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../msalConfig';
import Icon from '../icon.svg';

const Login = () => {
  const { instance, inProgress } = useMsal();
  const navigate = useNavigate();

  const handleLogin = () => {
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* <img
            className="mx-auto w-[120px] h-[120px] w-auto"
            src={Icon}
            alt="Smart Email"
          /> */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Login with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;