/**
 * Task API calls
 * Pure API functions - no hooks, no state
 */

import { apiClient } from '@/lib/api-client';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types/task';

/**
 * Fetch all tasks for the current user
 */
export async function getTasks(): Promise<Task[]> {
  return await apiClient<Task[]>('/tasks', { method: 'GET' });
}

/**
 * Create a new task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  return await apiClient<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Update an existing task
 */
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  return await apiClient<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  await apiClient(`/tasks/${id}`, { method: 'DELETE' });
}

/**
 * Reorder tasks - batch update task positions
 */
export async function reorderTasks(
  updates: Array<{ id: string; status: TaskStatus; order: number }>
): Promise<void> {
  await apiClient('/tasks/reorder', {
    method: 'POST',
    body: JSON.stringify({ updates }),
  });
}
