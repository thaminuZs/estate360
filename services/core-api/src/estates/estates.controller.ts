import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEstateDto } from './dtos/createEstateDto';
import { UpdateEstateDto } from './dtos/updateEstateDto';
import { EstatesService } from './providers/estates.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('estates')
@UseGuards(AuthGuard, RolesGuard)
export class EstatesController {
  constructor(private readonly estatesService: EstatesService) {}

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findAll(@ActiveUser() user: ActiveUserData) {
    return this.estatesService.findAll(user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get(':id')
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.estatesService.findOne(id, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post()
  public create(
    @Body() createEstateDto: CreateEstateDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.estatesService.createEstate(createEstateDto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstateDto: UpdateEstateDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.estatesService.updateEstate(id, updateEstateDto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Delete(':id')
  public remove(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.estatesService.deleteEstate(id, user);
  }
}
