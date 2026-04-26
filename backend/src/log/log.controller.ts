import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { RolesGuard } from '../auth/guards/role.guards';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enums/role.enum';
import type { CurrentUserData } from '../common/interfaces/request.interfaces';
import { CreateLogDto } from './dto/create-log.dto';
import { FilterLogDto } from './dto/filter-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { LogService } from './log.service';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  @Roles(Role.Employee, Role.Manager)
  create(
    @Body() createLogDto: CreateLogDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.logService.create(createLogDto, currentUser);
  }

  @Get()
  findAll(
    @Query() filterDto: FilterLogDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.logService.findAll(filterDto, currentUser);
  }

  @Patch(':id')
  @Roles(Role.Employee, Role.Manager)
  update(
    @Param('id') id: string,
    @Body() updateLogDto: UpdateLogDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.logService.update(id, updateLogDto, currentUser);
  }

  @Delete(':id')
  @Roles(Role.Employee, Role.Manager)
  remove(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserData) {
    return this.logService.remove(id, currentUser);
  }
}
