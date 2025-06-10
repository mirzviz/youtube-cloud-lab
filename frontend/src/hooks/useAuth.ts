import { useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      // @ts-ignore
      const idTokenPayload = session.tokens?.idToken?.payload;
      console.log('ID token payload:', idTokenPayload);
      setUser({
        ...currentUser,
        email: idTokenPayload?.email ?? '',
        name:
          idTokenPayload?.name ||
          (typeof idTokenPayload?.email === 'string'
            ? idTokenPayload.email.split('@')[0]
            : 'User')
      });
      setIsAuthenticated(true);
      console.log('Authenticated user:', currentUser, idTokenPayload);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.log('Not authenticated:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getAuthToken() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  return { isAuthenticated, user, isLoading, getAuthToken };
} 