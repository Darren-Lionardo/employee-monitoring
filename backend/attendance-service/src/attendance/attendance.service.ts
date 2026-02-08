import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { AttendanceRepository } from './domain/attendance.repository';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject('AttendanceRepository')
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async clockIn(employeeId: string, photoUrl: string | null) {
    return this.attendanceRepository.clockIn(
      employeeId,
      photoUrl,
    );
  }

  async clockOut(employeeId: string) {
    const lastAttendance = await this.attendanceRepository.findFirst(employeeId);

    if (!lastAttendance) throw new RpcException({
        statusCode: 404,
        message: 'No clock-in record found',
      });

    return this.attendanceRepository.clockOut(lastAttendance.id);
  }

  async findAllByEmployeeId(employeeId: string) {
    return this.attendanceRepository.findAllByEmployeeId(employeeId);
  }
}
