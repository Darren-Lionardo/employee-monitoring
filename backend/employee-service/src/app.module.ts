import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    PrismaModule,
    EmployeeModule
  ],
})
export class AppModule {}
