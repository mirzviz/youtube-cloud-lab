import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import VideoList from './VideoList';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuthContext } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const showVideo = location.pathname.startsWith('/video/');

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="pt-16 h-full w-full">
        <div className="flex h-[calc(100vh-4rem)] w-full">
          {/* Video List Panel - wider */}
          <div className="w-[32rem] min-w-[28rem] max-w-[36rem] h-full p-6 border-r border-gray-800 bg-gray-900 overflow-y-auto flex flex-col">
            {isAuthenticated ? (
              <VideoList />
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-400 text-lg">
                Please log in to view videos
              </div>
            )}
          </div>
          {/* Video Player Panel - always present, content depends on route */}
          <div className="flex-1 h-full p-6 bg-gray-900 overflow-y-auto">
            {showVideo && isAuthenticated && <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 