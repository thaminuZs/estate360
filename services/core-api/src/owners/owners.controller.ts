import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateOwnerDto } from './dtos/createOwnerDto';
import { PatchOwnerDto } from './dtos/patchOwnerDto';
import { OwnersService } from './providers/owners.service';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  public createOwners(@Body() createOwnerDto: CreateOwnerDto) {
    console.log(createOwnerDto);
  }

  @Patch('/:id')
  public patchOwner(
    @Param('id') ownerId: string,
    @Body() patchOwnerDto: PatchOwnerDto,
  ) {
    console.log(ownerId);
    console.log(patchOwnerDto);
  }
}
