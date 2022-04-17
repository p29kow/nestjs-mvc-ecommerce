import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerialiser } from './session.serialiser';

@Module({
  imports: [
    UsersModule,
    PassportModule,
  ],
  providers: [
    UsersService,
    AuthService,
    LocalStrategy,
    RolesGuard,
    SessionSerialiser
  ],
  controllers: [AuthController],
})
export class AuthModule {}
