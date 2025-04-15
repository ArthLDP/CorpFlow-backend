import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  FAZER_TAREFA = 'FAZER_TAREFA',
  VERIFICAR = 'VERIFICAR',
  APROVADO = 'APROVADO',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'text',
    enum: TaskStatus,
    default: TaskStatus.FAZER_TAREFA,
  })
  status: TaskStatus;

  @Column()
  attributed_to: number;

  @Column()
  finalDate: Date;

  @ManyToOne(() => User, user => user.tasks)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}