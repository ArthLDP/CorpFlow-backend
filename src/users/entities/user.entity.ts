import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, task => task.createdBy)
  tasks: Task[];

  @OneToOne(() => UserProfile, profile => profile.user, { cascade: true })
  profile: UserProfile;
}