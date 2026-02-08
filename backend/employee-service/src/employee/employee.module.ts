import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaModule } from 'src/prisma.module';
import { PrismaEmployeeRepository } from './infrastructure/prisma-employee.repository';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: 'EmployeeRepository',
      useClass: PrismaEmployeeRepository,
    },
  ],
})
export class EmployeeModule {}
