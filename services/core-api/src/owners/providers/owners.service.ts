import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Owner } from '../owner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOwnerDto } from '../dtos/createOwnerDto';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,
  ) {}

  public async createOwner(createOwnerDto: CreateOwnerDto) {
    let owner = this.ownersRepository.create(createOwnerDto);
    owner = await this.ownersRepository.save(owner);

    return owner;
  }
}
