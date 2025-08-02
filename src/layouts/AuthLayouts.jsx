// src/layouts/AuthLayouts.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import login from '../assets/login.jpg'; // update path if needed
import { Helmet } from 'react-helmet';

const AuthLayouts = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding / Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white items-center justify-center p-12">
        <div className="text-center">
          <img src={login} alt="App Logo" className="w-32 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-lg">Your journey starts here. Let's build something amazing.</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Helmet>
            <title>Authentication | Your App</title>
          </Helmet>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayouts;
