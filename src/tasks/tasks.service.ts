import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { User } from '../users/entities/user.entity';
import { UserType } from '../users/entities/user-profile.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      createdBy: user,
    });
    
    return this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ 
      relations: ['createdBy', 'createdBy.profile'],
      order: {
        status: 'ASC',
        updatedAt: 'DESC',
      }
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ 
      where: { id },
      relations: ['createdBy', 'createdBy.profile']
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    Object.assign(task, updateTaskDto);
    
    return this.tasksRepository.save(task);
  }

  async updateStatus(id: number, updateStatusDto: UpdateTaskStatusDto, user: User): Promise<Task> {
    const task = await this.findOne(id);
    const newStatus = updateStatusDto.status;
    const currentStatus = task.status;

    // Verificar se pode mover após 'APROVADO'
    if (currentStatus == TaskStatus.APROVADO) {
      throw new BadRequestException("Este bloco já foi aprovado, não é possível fazer mudanças");
    }
    
    // Verificar se pode mover para 'APROVADO'
    if (newStatus === TaskStatus.APROVADO && currentStatus !== TaskStatus.VERIFICAR) {
      throw new BadRequestException("Este bloco precisa estar em 'Verificar' para ser aprovado");
    }
    
    // Verificar permissão para aprovação (apenas gerentes)
    if (newStatus === TaskStatus.APROVADO) {
      if (user.profile.userType !== UserType.GERENTE) {
        throw new ForbiddenException("Apenas gerentes conseguem aprovar tarefas");
      }
    }
    
    task.status = newStatus;
    
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
