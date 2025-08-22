import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateTenantAndAdminDto } from './dto/create-tenant-and-admin.dto';
import { DataSource } from 'typeorm';
import { TenantsService } from 'src/tenants/tenants.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.findOneByUsername(signInDto.username);
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
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
