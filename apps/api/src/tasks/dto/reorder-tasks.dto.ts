import { IsArray, ValidateNested, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '@prisma/client';

export class TaskReorderItem {
  @IsString()
  id: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderTasksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskReorderItem)
  updates: TaskReorderItem[];
}
