import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreateTenantAndAdminDto } from 'src/auth/dto/create-tenant-and-admin.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tentantRepository: Repository<Tenant>,
  ) {}

  async create(createTenant: CreateTenantDto): Promise<Tenant> {
    const tenant = this.tentantRepository.create(createTenant);
    return this.tentantRepository.save(tenant);
  }

  async findOne(slug: string): Promise<Tenant | null> {
    const tenant = this.tentantRepository.findOne({
      where: { slug: slug },
    });
    return tenant;
  }

  async createTenantManager(
    manager: EntityManager,
    createTenantAndAdminDto: CreateTenantAndAdminDto,
  ): Promise<Tenant> {
    const { tenantName, tenantSlug } = createTenantAndAdminDto;
    const tenant = this.tentantRepository.create({
      name: tenantName,
      slug: tenantSlug,
    });
    return manager.save(tenant);
  }
}
