import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuthContext } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const { isAuthenticated } = useAuthContext();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">
          Welcome to YouTube Cloud Lab
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Upload and share your videos with the world
        </p>
      </div>
      {!isAuthenticated && (
        <div className="text-center text-gray-600 dark:text-gray-300">
          Please log in to view videos
        </div>
      )}
    </div>
  );
};

export default LandingPage; 