/**
 * Task Service - Placeholder for future API integration
 * This service will handle all task-related API calls
 */

import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types/task';

/**
 * Fetch all tasks for the current user
 * TODO: Implement API call to GET /api/tasks
 */
export async function getTasks(): Promise<Task[]> {
  // Placeholder: Return empty array
  // Future implementation will call: await apiClient.get<Task[]>('/tasks')
  return [];
}

/**
 * Create a new task
 * TODO: Implement API call to POST /api/tasks
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  // Placeholder: Generate a mock task
  // Future implementation will call: await apiClient.post<Task>('/tasks', input)
  const mockTask: Task = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    status: 'TODO',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return mockTask;
}

/**
 * Update an existing task
 * TODO: Implement API call to PATCH /api/tasks/:id
 */
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  // Placeholder: Return mock updated task
  // Future implementation will call: await apiClient.patch<Task>(`/tasks/${id}`, input)
  throw new Error('Not implemented - API integration pending');
}

/**
 * Delete a task
 * TODO: Implement API call to DELETE /api/tasks/:id
 */
export async function deleteTask(id: string): Promise<void> {
  // Placeholder: Do nothing
  // Future implementation will call: await apiClient.delete(`/tasks/${id}`)
  return;
}

/**
 * Reorder tasks - batch update task positions
 * TODO: Implement API call to POST /api/tasks/reorder
 */
export async function reorderTasks(updates: Array<{ id: string; status: TaskStatus; order: number }>): Promise<void> {
  // Placeholder: Do nothing
  // Future implementation will call: await apiClient.post('/tasks/reorder', { updates })
  console.log('Reorder tasks (will be persisted to backend):', updates);
  return;
}
