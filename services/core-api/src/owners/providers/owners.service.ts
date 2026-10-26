import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Owner } from '../owner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOwnerDto } from '../dtos/createOwnerDto';
import { PatchOwnerDto } from '../dtos/patchOwnerDto';
import { User } from 'src/auth/entities/users.entity';
import { Role } from 'src/auth/enums/role.enum';
import { UserStatus } from 'src/auth/enums/user-status.enum';
import { BcryptService } from 'src/auth/providers/bcrypt.service';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class OwnersService implements OnModuleInit {
  constructor(
    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly bcryptService: BcryptService,
  ) {}

  async onModuleInit() {
    try {
      await this.ownersRepository.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='owner' AND column_name='contact_email') THEN
            UPDATE "owner" SET "email" = "contact_email" WHERE "email" IS NULL;
          END IF;
        END $$;
      `);
    } catch {
      // Safe catch
    }
  }

  public async createOwner(createOwnerDto: CreateOwnerDto) {
    const rawEmail = createOwnerDto.email ?? createOwnerDto.contactEmail;
    if (!rawEmail) {
      throw new BadRequestException('Owner email is required');
    }

    const normalizedEmail = rawEmail.trim().toLowerCase();

    const [existingUser, existingOwner] = await Promise.all([
      this.usersRepository.findOne({ where: { email: normalizedEmail } }),
      this.ownersRepository.findOne({ where: { email: normalizedEmail } }),
    ]);

    if (existingUser || existingOwner) {
      throw new ConflictException(
        'An owner or user with this email already exists',
      );
    }

    let owner = this.ownersRepository.create({
      name: createOwnerDto.name,
      email: normalizedEmail,
      phone: createOwnerDto.phone,
      address: createOwnerDto.address,
      status: createOwnerDto.status,
    });
    owner = await this.ownersRepository.save(owner);

    if (createOwnerDto.password) {
      const passwordHash = await this.bcryptService.hashPassword(
        createOwnerDto.password,
      );
      const user = this.usersRepository.create({
        email: normalizedEmail,
        passwordHash,
        role: Role.OWNER,
        status: UserStatus.ACTIVE,
        owner,
      });
      await this.usersRepository.save(user);
    }

    return owner;
  }

  public async findAllOwners() {
    return this.ownersRepository.find({
      relations: { estates: true },
    });
  }

  public async findOneOwner(id: string, user?: ActiveUserData) {
    if (user && user.role === Role.OWNER && user.ownerId !== id) {
      throw new ForbiddenException(
        'You can only access your own owner profile',
      );
    }

    const owner = await this.ownersRepository.findOne({
      where: { id },
      relations: { estates: true },
    });

    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }

    return owner;
  }

  public async updateOwner(
    id: string,
    patchOwnerDto: PatchOwnerDto,
    user?: ActiveUserData,
  ) {
    const owner = await this.findOneOwner(id, user);

    if (patchOwnerDto.name !== undefined) {
      owner.name = patchOwnerDto.name;
    }

    const rawEmail = patchOwnerDto.email ?? patchOwnerDto.contactEmail;
    if (rawEmail !== undefined) {
      owner.email = rawEmail.trim().toLowerCase();
    }

    if (patchOwnerDto.phone !== undefined) {
      owner.phone = patchOwnerDto.phone;
    }
    if (patchOwnerDto.address !== undefined) {
      owner.address = patchOwnerDto.address;
    }
    if (patchOwnerDto.status !== undefined) {
      owner.status = patchOwnerDto.status;
    }

    if (patchOwnerDto.password) {
      const linkedUser = await this.usersRepository.findOne({
        where: { owner: { id } },
      });
      if (linkedUser) {
        linkedUser.passwordHash = await this.bcryptService.hashPassword(
          patchOwnerDto.password,
        );
        await this.usersRepository.save(linkedUser);
      }
    }

    return this.ownersRepository.save(owner);
  }

  public async deleteOwner(id: string) {
    const owner = await this.findOneOwner(id);
    await this.ownersRepository.remove(owner);
    return { message: 'Owner deleted successfully' };
  }
}
