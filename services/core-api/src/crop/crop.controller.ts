import { Body, Controller, Post } from '@nestjs/common';
import { CreateCropDto } from './dtos/createCropDto';
import { CropsService } from './providers/crops.service';

@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  public createCrop(@Body() createCropDto: CreateCropDto) {
    return this.cropsService.createCrop(createCropDto);
  }
}
