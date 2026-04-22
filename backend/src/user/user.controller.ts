import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { RolesGuard } from '../auth/guards/role.guards';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.Manager)
  findAll() {
    return this.userService.findAll();
  }
}
