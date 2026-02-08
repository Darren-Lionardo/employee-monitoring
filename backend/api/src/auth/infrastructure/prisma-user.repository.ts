import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { PrismaService } from 'src/prisma.service';
import { User } from '../domain/user.entity';
import { Role } from '../enums/role.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(email: string, password: string, role: Role): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
        role,
      },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  find(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, data: any): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(email: string): Promise<void> {
    await this.prisma.user.delete({ where: { email } });
  }
}
