/**
 * Auth API calls
 */

import { apiClient, setAuthToken } from '@/lib/api-client';
import { LoginCredentials, LoginResponse } from '@/types/auth';

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Store the token after successful login
  if (response.accessToken) {
    setAuthToken(response.accessToken);
  }

  return response;
}

export function logout(): void {
  setAuthToken(null);
}
