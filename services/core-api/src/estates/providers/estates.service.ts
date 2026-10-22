import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstateDto } from '../dtos/createEstateDto';
import { Repository } from 'typeorm';
import { Estate } from '../estate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Crop } from 'src/crop/crop.entity';
import { Owner } from 'src/owners/owner.entity';

@Injectable()
export class EstatesService {
  constructor(
    @InjectRepository(Estate)
    private readonly estatesRepository: Repository<Estate>,

    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  public async createEstate(createEstateDto: CreateEstateDto) {
    //const estate = this.estatesRepository.create(createEstateDto);
    //return await this.estatesRepository.save(estate);
    const crop = await this.cropRepository.findOne({
      where: {
        id: createEstateDto.crop,
      },
    });

    if (!crop) throw new NotFoundException('crop not found');

    const owner = await this.ownerRepository.findOne({
      where: {
        id: createEstateDto.owner,
      },
    });

    if (!owner) throw new NotFoundException('owner not found');

    const estate = this.estatesRepository.create({
      owner,
      crop,
      name: createEstateDto.name,
      code: createEstateDto.code,
      location: createEstateDto.location,
      boundary: createEstateDto.boundary,
      status: createEstateDto.status,
    });

    return await this.estatesRepository.save(estate);
  }
}
