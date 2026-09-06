import { Injectable } from '@nestjs/common';
import { CreateEstateDto } from '../dtos/createEstateDto';
import { Repository } from 'typeorm';
import { Estate } from '../estate.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EstatesService {
  constructor(
    @InjectRepository(Estate)
    private readonly estatesRepository: Repository<Estate>,
  ) {}

  public async createEstate(createEstateDto: CreateEstateDto) {
    const estate = this.estatesRepository.create(createEstateDto);
    return await this.estatesRepository.save(estate);
  }
}
