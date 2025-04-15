import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  attributed_to: number

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus = TaskStatus.FAZER_TAREFA;
}