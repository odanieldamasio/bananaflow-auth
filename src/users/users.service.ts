import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
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

  async findOneByUsernameAndTenant(
    username: string,
    tenantId: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username: username, tenantId: tenantId },
      relations: ['tenant'],
    });
    return user;
  }

  async createUserManager(
    manager: EntityManager,
    createTenantAndAdminDto: CreateTenantAndAdminDto,
    tenantId: string,
  ): Promise<User> {
    const { adminEmail, adminPassword, adminName, adminUsername } =
      createTenantAndAdminDto;
    // const checkIfUserExists = await this.userRepository.findOne({
    //   where: { email: adminEmail, tenantId: tenantId },
    // });
    // if (checkIfUserExists)
    //   throw new BadRequestException('Email já cadastrado.');

    const hashed = await bcrypt.hash(adminPassword, 10);

    const user = this.userRepository.create({
      name: adminName,
      username: adminUsername,
      password: hashed,
      email: adminEmail,
      tenantId,
    });

    return manager.save(user);
  }
}
