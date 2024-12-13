import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function TestLogin() {
  const { setIsLoggedIn } = useAuth(); // Get setIsLoggedIn from context
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      // Redirect to Microsoft login
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { accessToken } = data; // Assuming the access token is returned in the response

      // Save the access token in local storage
      localStorage.setItem('accessToken', accessToken);
      setIsLoggedIn(true); // Update the login state
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Microsoft</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default TestLogin;