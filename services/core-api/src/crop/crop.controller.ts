import { Body, Controller, Post } from '@nestjs/common';
import { CreateCropDto } from './dtos/createCropDto';

@Controller('crops')
export class CropsController {
  @Post()
  public createCrop(@Body() createCropDto: CreateCropDto) {
    console.log(createCropDto);
  }
}
