import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { PrismaAttendanceRepository } from './infrastructure/prisma-attendance.repository';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    {
      provide: 'AttendanceRepository',
      useClass: PrismaAttendanceRepository,
    },
  ],
})
export class AttendanceModule {}
