import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateTenantAndAdminDto } from 'src/auth/dto/create-tenant-and-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    return user;
  }

  async createUserManager(
    manager: EntityManager,
    createTenantAndAdminDto: CreateTenantAndAdminDto,
    tenantId: string,
  ): Promise<User> {
    const { adminEmail, adminPassword, adminName } = createTenantAndAdminDto;
    const user = this.userRepository.create({
      name: adminName,
      password: adminPassword,
      email: adminEmail,
      tenantId,
    });

    return manager.save(user);
  }
}
