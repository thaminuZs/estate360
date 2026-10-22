import { Injectable } from '@nestjs/common';
import { CreateCropDto } from '../dtos/createCropDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Crop } from '../crop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  public async createCrop(createCropDto: CreateCropDto) {
    let crop = this.cropRepository.create(createCropDto);
    crop = await this.cropRepository.save(crop);

    return crop;
  }
}
