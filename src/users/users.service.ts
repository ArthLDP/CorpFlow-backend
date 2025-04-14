import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile, UserType } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profilesRepository: Repository<UserProfile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, userType } = createUserDto;
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar perfil de usuário
    const profile = this.profilesRepository.create({
      userType: userType || UserType.USUARIO,
    });
    
    // Criar usuário com perfil associado
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      profile,
    });
    
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['profile'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['profile'] 
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { username },
      relations: ['profile'] 
    });
    
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    if (updateUserDto.userType) {
      user.profile.userType = updateUserDto.userType;
      await this.profilesRepository.save(user.profile);
      delete updateUserDto.userType;
    }
    
    Object.assign(user, updateUserDto);
    
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}