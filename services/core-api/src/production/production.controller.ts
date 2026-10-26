import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProductionService } from './providers/production.service';
import { CreateProductionRecordDto } from './dtos/create-production-record.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('production')
@UseGuards(AuthGuard, RolesGuard)
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Post()
  public create(
    @Body() dto: CreateProductionRecordDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.productionService.create(dto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Get()
  public findAll(
    @Query('workerId') workerId?: string,
    @Query('estateId') estateId?: string,
    @Query('workSessionId') workSessionId?: string,
    @ActiveUser() user?: ActiveUserData,
  ) {
    return this.productionService.findAll(
      {
        workerId,
        estateId,
        workSessionId,
      },
      user,
    );
  }
}
