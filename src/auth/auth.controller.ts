import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateTenantAndAdminDto } from './dto/create-tenant-and-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(
    @Body() signInDto: SignInDto,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID é obrigatório no header');
    }

    return this.authService.signIn(signInDto, tenantId);
  }

  @Post('register')
  signUp(@Body() createTenantAndAdminDto: CreateTenantAndAdminDto) {
    return this.authService.signUp(createTenantAndAdminDto);
  }
}
