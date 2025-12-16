/**
 * Auth API calls
 */

import { apiClient } from '@/lib/api-client';
import { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from '@/types/auth';

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return response;
}

export async function registerUser(credentials: RegisterCredentials): Promise<RegisterResponse> {
  const response = await apiClient<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return response;
}
