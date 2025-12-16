/**
 * Task types and interfaces
 */

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  order?: number;
}

export interface TasksByStatus {
  TODO: Task[];
  IN_PROGRESS: Task[];
  DONE: Task[];
}
