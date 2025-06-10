import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import VideoUpload from './components/VideoUpload';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className={isDarkMode ? 'dark' : ''}>
        <Routes>
          <Route
            path="/"
            element={<LandingPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            path="/upload"
            element={
              isAuthenticated ? (
                <VideoUpload isDarkMode={isDarkMode} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
