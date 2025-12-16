/**
 * Server-side Task API calls
 * Used for Server Components (SSR)
 */

import { cookies } from 'next/headers';
import { Task } from '@/types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch tasks server-side with cookies
 * This runs on the server and has access to request cookies
 */
export async function getTasksServerSide(): Promise<Task[]> {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      console.warn('No auth token found on server');
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth_token=${authToken}`,
      },
      credentials: 'include',
      // Disable caching for fresh data on each request
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch tasks server-side:', response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks server-side:', error);
    // Return empty array instead of throwing to gracefully handle errors
    return [];
  }
}
