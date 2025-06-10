import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // Optionally, listen for auth events here for real-time updates
  }, []);

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      // @ts-ignore
      const idTokenPayload = session.tokens?.idToken?.payload;
      const userObj = {
        ...currentUser,
        email: idTokenPayload?.email ?? '',
        name:
          idTokenPayload?.name ||
          (typeof idTokenPayload?.email === 'string'
            ? idTokenPayload.email.split('@')[0]
            : 'User')
      };
      setUser(userObj);
      setIsAuthenticated(true);
      console.log('[Auth] Authenticated user:', userObj);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.error('[Auth] Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getAuthToken() {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      return token !== undefined ? token : null;
    } catch (error) {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, getAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 