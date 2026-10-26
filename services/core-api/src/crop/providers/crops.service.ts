import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCropDto } from '../dtos/createCropDto';
import { UpdateCropDto } from '../dtos/updateCropDto';
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
    const existing = await this.cropRepository.findOne({
      where: [{ name: createCropDto.name }, { code: createCropDto.code }],
    });

    if (existing) {
      throw new ConflictException(
        'A crop with this name or code already exists',
      );
    }

    const crop = this.cropRepository.create(createCropDto);
    return this.cropRepository.save(crop);
  }

  public async findAllCrops() {
    return this.cropRepository.find();
  }

  public async findOneCrop(id: string) {
    const crop = await this.cropRepository.findOne({ where: { id } });
    if (!crop) {
      throw new NotFoundException(`Crop with ID ${id} not found`);
    }
    return crop;
  }

  public async updateCrop(id: string, updateCropDto: UpdateCropDto) {
    const crop = await this.findOneCrop(id);
    Object.assign(crop, updateCropDto);
    return this.cropRepository.save(crop);
  }

  public async deleteCrop(id: string) {
    const crop = await this.findOneCrop(id);
    await this.cropRepository.remove(crop);
    return { message: 'Crop deleted successfully' };
  }
}
