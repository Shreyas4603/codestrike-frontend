import React from 'react';

const NotFound = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-background text-text ">
      <div className="text-center">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-2xl mt-4">Page Not Found</p>
        <p className="text-lg mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
