import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import VideoUpload from './components/VideoUpload';
import Toolbar from './components/Toolbar';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import './App.css';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Toolbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/upload"
          element={
            isAuthenticated ? (
              <VideoUpload />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <AppContent />
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
