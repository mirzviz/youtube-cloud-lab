import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the AuthContext since it's required by the App
vi.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuthContext: () => ({
    isLoading: false,
    isAuthenticated: false,
  }),
}));

// Mock the DarkModeContext
vi.mock('./contexts/DarkModeContext', () => ({
  DarkModeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useDarkMode: () => ({
    isDarkMode: false,
    toggleDarkMode: () => {},
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check for the app title instead of navigation role
    expect(screen.getByText('YouTube Cloud Lab')).toBeInTheDocument();
  });
}); 