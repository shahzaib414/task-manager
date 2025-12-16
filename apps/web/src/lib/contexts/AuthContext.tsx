/**
 * Auth Context - Global authentication state management
 * NOTE: Middleware handles route protection, this is just for UI state
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';
import { getAuthToken, getUserData, setAuthCookie, setUserData, clearAuthCookies } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user data from cookies on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      const userData = getUserData();
      
      if (token && userData) {
        setUser(userData);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (user: User, token: string) => {
    // Store in cookies (accessible to middleware)
    setAuthCookie(token);
    setUserData(user);
    
    // Update state
    setUser(user);
  };

  const logout = () => {
    // Clear cookies
    clearAuthCookies();
    
    // Update state
    setUser(null);
    
    // Redirect to login
    router.push('/login');
    router.refresh(); // Force middleware to run
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
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
