/**
 * Auth API calls
 */

import { apiClient } from '@/lib/api-client';
import { LoginCredentials, LoginResponse } from '@/types/auth';

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return response;
}
