import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaUserRepository } from 'src/auth/infrastructure/prisma-user.repository';
import 'dotenv/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMPLOYEE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.EMPLOYEE_HOST || 'localhost',
          port: parseInt(process.env.EMPLOYEE_PORT || '4001'),
        },
      },
    ]),
    AuthModule,
  ],
  providers: [
    AuthService,
    JwtService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
