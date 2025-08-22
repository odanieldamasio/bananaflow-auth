import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TenantsModule } from 'src/tenants/tenants.module';

@Module({
  imports: [
    UsersModule,
    TenantsModule,
    JwtModule.register({
      global: true,
      secret: 'SECRET',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
