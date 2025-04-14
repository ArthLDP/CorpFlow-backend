import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum UserType {
  GERENTE = 'GERENTE',
  USUARIO = 'USUARIO',
}

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    enum: UserType,
    default: UserType.USUARIO,
  })
  userType: UserType;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn()
  user: User;
}
