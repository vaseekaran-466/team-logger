import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { RolesGuard } from './guards/role.guards';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'team-logger-secret',
    }),
  ],
  providers: [JwtAuthGuard, RolesGuard],
  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthGuardModule {}
