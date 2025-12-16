import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Task, TaskStatus } from '@prisma/client';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  /**
   * Get all tasks for a user
   */
  async findAllByUser(userId: string): Promise<Task[]> {
    return this.tasksRepository.findAllByUserId(userId);
  }

  /**
   * Get a single task by ID
   */
  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findByIdAndUserId(id, userId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Create a new task
   */
  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const maxOrder = await this.tasksRepository.getMaxOrderByUserAndStatus(userId, TaskStatus.TODO);

    return this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.TODO,
      order: maxOrder + 1,
      user: {
        connect: { id: userId },
      },
    });
  }

  /**
   * Update a task
   */
  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id, userId);

    if (updateTaskDto.status !== undefined) {
      const maxOrder = await this.tasksRepository.getMaxOrderByUserAndStatus(
        userId,
        updateTaskDto.status,
      );

      if (updateTaskDto.order === undefined) {
        updateTaskDto.order = maxOrder + 1;
      }
    }

    return this.tasksRepository.update(id, updateTaskDto);
  }

  /**
   * Delete a task
   */
  async delete(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);

    await this.tasksRepository.delete(id);
  }

  /**
   * Reorder multiple tasks (used for drag and drop in Kanban)
   */
  async reorder(userId: string, reorderTasksDto: ReorderTasksDto): Promise<void> {
    const taskIds = reorderTasksDto.updates.map((update) => update.id);
    const verificationPromises = taskIds.map((id) =>
      this.tasksRepository.findByIdAndUserId(id, userId),
    );
    const tasks = await Promise.all(verificationPromises);
    const notFoundTask = tasks.findIndex((task) => task === null);
    if (notFoundTask !== -1) {
      throw new ForbiddenException(
        `Task with ID ${taskIds[notFoundTask]} not found or access denied`,
      );
    }

    await this.tasksRepository.batchUpdate(reorderTasksDto.updates);
  }
}
