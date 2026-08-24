import { Body, Controller, Post } from '@nestjs/common';
import { CreateOwnerDto } from './dtos/createOwnerDto';

@Controller('owners')
export class OwnersController {
  @Post()
  public createOwners(@Body() createOwnerDto: CreateOwnerDto) {
    console.log(createOwnerDto);
  }
}
