import React from 'react';

const Unauthorised = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-lg text-gray-600">You don’t have access to this page.</p>
    </div>
  );
};

export default Unauthorised;