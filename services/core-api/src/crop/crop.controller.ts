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
import { CreateCropDto } from './dtos/createCropDto';
import { UpdateCropDto } from './dtos/updateCropDto';
import { CropsService } from './providers/crops.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('crops')
@UseGuards(AuthGuard, RolesGuard)
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Roles(Role.ADMIN)
  @Post()
  public createCrop(@Body() createCropDto: CreateCropDto) {
    return this.cropsService.createCrop(createCropDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findAll() {
    return this.cropsService.findAllCrops();
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get(':id')
  public findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropsService.findOneCrop(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  public updateCrop(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCropDto: UpdateCropDto,
  ) {
    return this.cropsService.updateCrop(id, updateCropDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  public deleteCrop(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropsService.deleteCrop(id);
  }
}
