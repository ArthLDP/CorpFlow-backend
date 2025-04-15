import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserType } from './users/entities/user-profile.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  
  try {
    // Criar usuário gerente
    await usersService.create({
      username: 'Chefe',
      email: 'chefe@example.com',
      password: '123',
      userType: UserType.GERENTE,
    });
    console.log('Usuário gerente criado com sucesso!');
    
    // Criar usuário comum
    await usersService.create({
      username: 'Trabalhador',
      email: 'Trabalhador@example.com',
      password: '123',
      userType: UserType.USUARIO,
    });
    console.log('Usuário comum criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  } finally {
    await app.close();
  }
}

bootstrap();