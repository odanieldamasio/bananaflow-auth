import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateTenantAndAdminDto } from './dto/create-tenant-and-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('register')
  signUp(@Body() createTenantAndAdminDto: CreateTenantAndAdminDto) {
    return this.authService.signUp(createTenantAndAdminDto);
  }
}
