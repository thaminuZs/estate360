import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstateDto } from '../dtos/createEstateDto';
import { UpdateEstateDto } from '../dtos/updateEstateDto';
import { Repository } from 'typeorm';
import { Estate } from '../estate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Crop } from 'src/crop/crop.entity';
import { Owner } from 'src/owners/owner.entity';
import { Role } from 'src/auth/enums/role.enum';
import { EstateStatus } from '../enums/estate-status.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

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

  public async findAll(user?: ActiveUserData) {
    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      return this.estatesRepository.find({
        where: { owner: { id: user.ownerId } },
        relations: { owner: true, crop: true },
      });
    }

    return this.estatesRepository.find({
      relations: { owner: true, crop: true },
    });
  }

  public async findOne(id: string, user?: ActiveUserData) {
    const estate = await this.estatesRepository.findOne({
      where: { id },
      relations: { owner: true, crop: true },
    });

    if (!estate) {
      throw new NotFoundException(`Estate with ID ${id} not found`);
    }

    if (user && user.role === Role.OWNER && estate.owner?.id !== user.ownerId) {
      throw new ForbiddenException('You do not have access to this estate');
    }

    return estate;
  }

  public async createEstate(
    createEstateDto: CreateEstateDto,
    user?: ActiveUserData,
  ) {
    const cropId = createEstateDto.cropId ?? createEstateDto.crop;
    const requestedOwnerId = createEstateDto.ownerId ?? createEstateDto.owner;

    let ownerId = requestedOwnerId;

    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      if (requestedOwnerId && requestedOwnerId !== user.ownerId) {
        throw new ForbiddenException(
          'You can only create estates under your own owner account',
        );
      }
      ownerId = user.ownerId;
    }

    if (!cropId || !ownerId) {
      throw new BadRequestException('Both crop and owner IDs are required');
    }

    const existingCode = await this.estatesRepository.findOne({
      where: { code: createEstateDto.code },
    });
    if (existingCode) {
      throw new ConflictException('An estate with this code already exists');
    }

    const [crop, owner] = await Promise.all([
      this.cropRepository.findOne({ where: { id: cropId } }),
      this.ownerRepository.findOne({ where: { id: ownerId } }),
    ]);

    if (!crop) throw new NotFoundException('Crop not found');
    if (!owner) throw new NotFoundException('Owner not found');

    // Automatically set estate status as active for owner upon registration
    const status =
      user && user.role === Role.OWNER
        ? EstateStatus.ACTIVE
        : (createEstateDto.status ?? EstateStatus.ACTIVE);

    const estate = this.estatesRepository.create({
      owner,
      crop,
      name: createEstateDto.name,
      code: createEstateDto.code,
      location: createEstateDto.location,
      boundary: createEstateDto.boundary,
      status,
    });

    return this.estatesRepository.save(estate);
  }

  public async updateEstate(
    id: string,
    updateEstateDto: UpdateEstateDto,
    user?: ActiveUserData,
  ) {
    const estate = await this.findOne(id, user);

    const cropId = updateEstateDto.cropId ?? updateEstateDto.crop;
    if (cropId) {
      const crop = await this.cropRepository.findOne({ where: { id: cropId } });
      if (!crop) throw new NotFoundException('Crop not found');
      estate.crop = crop;
    }

    const ownerId = updateEstateDto.ownerId ?? updateEstateDto.owner;
    if (ownerId) {
      if (user && user.role === Role.OWNER && ownerId !== user.ownerId) {
        throw new ForbiddenException(
          'You cannot transfer an estate to another owner',
        );
      }
      const owner = await this.ownerRepository.findOne({
        where: { id: ownerId },
      });
      if (!owner) throw new NotFoundException('Owner not found');
      estate.owner = owner;
    }

    if (updateEstateDto.name !== undefined) {
      estate.name = updateEstateDto.name;
    }
    if (updateEstateDto.code !== undefined) {
      estate.code = updateEstateDto.code;
    }
    if (updateEstateDto.location !== undefined) {
      estate.location = updateEstateDto.location;
    }
    if (updateEstateDto.boundary !== undefined) {
      estate.boundary = updateEstateDto.boundary;
    }
    if (updateEstateDto.status !== undefined) {
      estate.status = updateEstateDto.status;
    }

    return this.estatesRepository.save(estate);
  }

  public async deleteEstate(id: string, user?: ActiveUserData) {
    const estate = await this.findOne(id, user);
    try {
      await this.estatesRepository.query(
        'DELETE FROM "estate_assignment" WHERE "estate_id" = $1',
        [estate.id],
      );
      await this.estatesRepository.query(
        'DELETE FROM "worker_assignment" WHERE "estate_id" = $1',
        [estate.id],
      );
    } catch {
      // Safe catch
    }
    await this.estatesRepository.remove(estate);
    return { message: 'Estate deleted successfully' };
  }
}
