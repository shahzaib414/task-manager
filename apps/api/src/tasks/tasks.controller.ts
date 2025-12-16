import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface JwtPayload {
  sub: string;
  email: string;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * GET /tasks
   * Get all tasks for the current user
   */
  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.tasksService.findAllByUser(user.sub);
  }

  /**
   * GET /tasks/:id
   * Get a single task by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.tasksService.findOne(id, user.sub);
  }

  /**
   * POST /tasks
   * Create a new task
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.create(user.sub, createTaskDto);
  }

  /**
   * PATCH /tasks/:id
   * Update a task
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.update(id, user.sub, updateTaskDto);
  }

  /**
   * DELETE /tasks/:id
   * Delete a task
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.tasksService.delete(id, user.sub);
  }

  /**
   * POST /tasks/reorder
   * Batch update task positions (for drag and drop)
   */
  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  async reorder(
    @Body() reorderTasksDto: ReorderTasksDto,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.tasksService.reorder(user.sub, reorderTasksDto);
    return { success: true };
  }
}
