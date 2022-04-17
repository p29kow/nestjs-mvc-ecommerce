import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}
  private logger = new Logger(AuthService.name)

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }  

  async updateUserStatus(
    id: string,
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    const { userRole } = authCredentialsDto;
    const user = await this.usersRepository.findOne(id);

    user.userRole = userRole;
    await this.usersRepository.save(user);
  }
}
