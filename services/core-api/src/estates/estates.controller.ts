import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateEstateDto } from './dtos/createEstateDto';
import { EstatesService } from './providers/estates.service';

@Controller('estates')
export class EstatesController {
  constructor(private readonly estatesService: EstatesService) {}

  @Get()
  public findAll() {
    console.log();
  }

  @Get(':id')
  public findOne() {
    console.log();
  }

  @Post('/:id')
  public create(@Body() createEstateDto: CreateEstateDto) {
    return this.estatesService.createEstate(createEstateDto);
  }

  @Patch()
  public update() {
    console.log();
  }

  @Delete()
  public delete() {
    console.log();
  }
}
