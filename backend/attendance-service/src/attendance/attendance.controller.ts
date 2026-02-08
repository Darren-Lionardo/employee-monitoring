import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern('attendance.clockIn')
  async clockIn(
    @Payload() payload: {
      employeeId: string,
      photoUrl: string | null
    }
  ) {
    return this.attendanceService.clockIn(
      payload.employeeId,
      payload.photoUrl,
    );
  }

  @MessagePattern('attendance.clockOut')
  async clockOut(@Payload() payload: {
      employeeId: string
    }) {
    return this.attendanceService.clockOut(payload.employeeId);
  }

  @MessagePattern('attendance.findAllByEmployeeId')
  async findAll(@Payload() payload: {
      employeeId: string
    }) {
    return this.attendanceService.findAllByEmployeeId(payload.employeeId);
  }
}