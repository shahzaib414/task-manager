/**
 * Auth hooks - for login form
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import { loginUser } from '@/lib/api/auth';
import { LoginCredentials } from '@/types/auth';
import { ApiError } from '@/lib/api-client';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login: setAuthUser } = useAuthContext();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loginUser(credentials);
      
      // Update global auth context
      setAuthUser(response.user, response.accessToken);
      
      // Redirect to dashboard after successful login
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

  return {
    isLoading,
    error,
    login,
  };
}
