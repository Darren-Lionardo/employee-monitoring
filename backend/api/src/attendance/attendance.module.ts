import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaUserRepository } from 'src/auth/infrastructure/prisma-user.repository';
import 'dotenv/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ATTENDANCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ATTENDANCE_HOST || 'localhost',
          port: parseInt(process.env.ATTENDANCE_PORT || '4002'),
        },
      },
    ]),
    AuthModule,
  ],
  providers: [
    JwtService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
