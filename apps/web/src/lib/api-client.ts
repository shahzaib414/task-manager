/**
 * Base API client for making HTTP requests
 */

import { User } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * API Error Response structure (matches NestJS error format)
 */
export interface ApiErrorResponse {
  statusCode?: number;
  message: string | string[];
  error?: string;
  [key: string]: string | number | string[] | undefined;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: ApiErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from cookies
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      const errorMessage = Array.isArray(errorData.message) 
        ? errorData.message.join(', ') 
        : errorData.message || 'An error occurred';
      
      throw new ApiError(
        response.status,
        errorMessage,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error occurred');
  }
}

// Cookie-based auth helpers (server and client compatible)
export function setAuthCookie(token: string) {
  if (typeof window !== 'undefined') {
    // Set cookie on client side
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
  }
}

export function setUserData(user: User) {
  if (typeof window !== 'undefined') {
    document.cookie = `auth_user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
  }
}

export function clearAuthCookies() {
  if (typeof window !== 'undefined') {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('auth_token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
  return null;
}

export function getUserData(): User | null {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(c => c.trim().startsWith('auth_user='));
    if (userCookie) {
      try {
        return JSON.parse(decodeURIComponent(userCookie.split('=')[1])) as User;
      } catch {
        return null;
      }
    }
  }
  return null;
}
