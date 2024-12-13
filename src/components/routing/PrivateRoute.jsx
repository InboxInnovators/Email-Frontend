import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

const PrivateRoute = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount(); // Check if the user is authenticated

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to the login page
    return activeAccount ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute; 