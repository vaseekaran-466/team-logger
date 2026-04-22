import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthGuardModule } from './auth-guard.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, AuthGuardModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, AuthGuardModule],
})
export class AuthModule {}
