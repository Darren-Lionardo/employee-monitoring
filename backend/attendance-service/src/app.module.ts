import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance/attendance.controller';
import { PrismaModule } from './prisma.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    PrismaModule,
    AttendanceModule
  ],
})
export class AppModule {}
