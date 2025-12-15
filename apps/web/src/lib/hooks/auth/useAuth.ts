/**
 * Auth hooks
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logout as logoutUser } from '@/lib/api/auth';
import { LoginCredentials, User } from '@/types/auth';
import { ApiError } from '@/lib/api-client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loginUser(credentials);
      setUser(response.user);
      
      // Redirect to home page after successful login
      router.push('/');
      
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
