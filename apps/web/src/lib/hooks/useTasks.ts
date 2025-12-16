/**
 * Task hooks - SWR integration for task management
 * Similar to useAuth.ts pattern - adds state management on top of API calls
 */

'use client';

import useSWR, { mutate } from 'swr';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types/task';
import { createTask, getTasks, updateTask, deleteTask, reorderTasks } from '@/lib/api/tasks';

const TASKS_KEY = '/api/tasks';

/**
 * Fetcher function for SWR
 */
const tasksFetcher = async (): Promise<Task[]> => {
  return await getTasks();
};

/**
 * Hook to fetch and manage tasks with SWR
 */
export function useTasks(initialData?: Task[]) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<Task[]>(
    TASKS_KEY,
    tasksFetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data || [],
    isLoading,
    isError: error,
    revalidate,
  };
}

/**
 * Hook for task operations with optimistic updates
 */
export function useTaskOperations() {
  const addTask = async (input: CreateTaskInput): Promise<Task> => {
    const newTask = await createTask(input);

    // Optimistically update the cache
    mutate(
      TASKS_KEY,
      (currentTasks: Task[] = []) => {
        // Calculate order (last position in TODO column)
        const todoTasks = currentTasks.filter(t => t.status === 'TODO');
        const maxOrder = todoTasks.length > 0
          ? Math.max(...todoTasks.map(t => t.order))
          : -1;

        return [
          ...currentTasks,
          { ...newTask, order: maxOrder + 1 },
        ];
      },
      false // Don't revalidate immediately
    );

    return newTask;
  };

  const modifyTask = async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const updatedTask = await updateTask(id, input);

    // Optimistically update the cache
    mutate(
      TASKS_KEY,
      (currentTasks: Task[] = []) =>
        currentTasks.map(task => (task.id === id ? updatedTask : task)),
      false
    );

    return updatedTask;
  };

  const removeTask = async (id: string): Promise<void> => {
    await deleteTask(id);

    // Optimistically update the cache
    mutate(
      TASKS_KEY,
      (currentTasks: Task[] = []) => currentTasks.filter(task => task.id !== id),
      false
    );
  };

  const reorderTaskList = async (
    updates: Array<{ id: string; status: TaskStatus; order: number }>
  ): Promise<void> => {
    // Optimistically update the cache
    mutate(
      TASKS_KEY,
      (currentTasks: Task[] = []) => {
        const taskMap = new Map(currentTasks.map(t => [t.id, t]));

        updates.forEach(({ id, status, order }) => {
          const task = taskMap.get(id);
          if (task) {
            taskMap.set(id, { ...task, status, order });
          }
        });

        return Array.from(taskMap.values());
      },
      false
    );

    // Call API to persist changes
    await reorderTasks(updates);
  };

  return {
    addTask,
    modifyTask,
    removeTask,
    reorderTaskList,
  };
}
