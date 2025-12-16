import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskStatus, Prisma } from '@prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all tasks for a specific user
   */
  async findAllByUserId(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: [{ status: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Find a task by ID and user ID (ensures user owns the task)
   */
  async findByIdAndUserId(id: string, userId: string): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  /**
   * Create a new task
   */
  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  /**
   * Update a task
   */
  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a task
   */
  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  /**
   * Get the maximum order value for a specific user and status
   */
  async getMaxOrderByUserAndStatus(userId: string, status: TaskStatus): Promise<number> {
    const result = await this.prisma.task.aggregate({
      where: {
        userId,
        status,
      },
      _max: {
        order: true,
      },
    });

    return result._max.order ?? -1;
  }

  /**
   * Batch update tasks (for reordering)
   */
  async batchUpdate(
    updates: Array<{ id: string; status: TaskStatus; order: number }>,
  ): Promise<void> {
    await this.prisma.$transaction(
      updates.map((update) =>
        this.prisma.task.update({
          where: { id: update.id },
          data: {
            status: update.status,
            order: update.order,
          },
        }),
      ),
    );
  }
}
