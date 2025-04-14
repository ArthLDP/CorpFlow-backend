import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const payload = { 
      sub: user.id, 
      username: user.username,
      email: user.email,
      userType: user.profile.userType,
    };
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      user_type: user.profile.userType,
      token: this.jwtService.sign(payload),
    };
  }
}