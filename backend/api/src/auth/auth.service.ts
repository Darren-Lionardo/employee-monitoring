import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from './domain/user.repository';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  getProfile(id: string) {
    return this.userRepository.find(id);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registerEmployee(dto: LoginDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.userRepository.create(dto.email, hashedPassword, Role.EMPLOYEE);
  }

  async deleteEmployee(email: string) {
    await this.userRepository.delete(email);

    return {
      success: true,
    };
  }

  async registerHrd(dto: LoginDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.userRepository.create(dto.email, hashedPassword, Role.HRD);
  }
}
