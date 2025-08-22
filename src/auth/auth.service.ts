import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateTenantAndAdminDto } from './dto/create-tenant-and-admin.dto';
import { DataSource } from 'typeorm';
import { TenantsService } from 'src/tenants/tenants.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async signIn(signInDto: SignInDto, tenantId: string): Promise<any> {
    const user = await this.usersService.findOneByUsernameAndTenant(
      signInDto.username,
      tenantId,
    );

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const userIsAuthenticated = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!userIsAuthenticated) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const { password, ...result } = user;

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      access_token: accessToken,
    };
  }

  async signUp(createTenantAndAdminDto: CreateTenantAndAdminDto) {
    return this.dataSource.transaction(async (manager) => {
      const tenant = await this.tenantsService.createTenantManager(
        manager,
        createTenantAndAdminDto,
      );

      const admin = await this.usersService.createUserManager(
        manager,
        createTenantAndAdminDto,
        tenant.id,
      );

      return { tenant, admin };
    });
  }
}
