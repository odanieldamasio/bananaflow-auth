import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    constructor() {}

    async signIn(signInDto: SignInDto): Promise<any> {
        // regras de negócio
    }
}
