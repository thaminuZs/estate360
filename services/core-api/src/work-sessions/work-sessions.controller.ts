import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkSessionsService } from './providers/work-sessions.service';
import {
  CreateWorkSessionDto,
  EndWorkSessionDto,
} from './dtos/work-session.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('work-sessions')
@UseGuards(AuthGuard, RolesGuard)
export class WorkSessionsController {
  constructor(private readonly sessionsService: WorkSessionsService) {}

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Post()
  public startSession(
    @Body() createDto: CreateWorkSessionDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.sessionsService.startSession(createDto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Patch(':id/end')
  public endSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() endDto: EndWorkSessionDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.sessionsService.endSession(id, endDto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Get()
  public findAll(
    @ActiveUser() user: ActiveUserData,
    @Query('workerId') workerId?: string,
    @Query('estateId') estateId?: string,
    @Query('status') status?: string,
  ) {
    return this.sessionsService.findAll({ workerId, estateId, status }, user);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Get(':id')
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.sessionsService.findOne(id, user);
  }
}
