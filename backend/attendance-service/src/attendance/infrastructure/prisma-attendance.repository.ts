import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AttendanceRepository } from "../domain/attendance.repository";
import { Attendance } from "../domain/attendance.entity";

@Injectable()
export class PrismaAttendanceRepository implements AttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  clockIn(employeeId: string, photoUrl: string | null, clockIn: Date = new Date()): Promise<Attendance> {
    return this.prisma.attendance.create({
      data: {
        employee_id: employeeId,
        clock_in: clockIn,
        photo_url: photoUrl
      }
    });
  }

  clockOut(id: string, clockOut: Date = new Date()): Promise<Attendance> {
    return this.prisma.attendance.update({
      where: { id },
      data: {
        clock_out: clockOut,
      },
    });
  }

  findFirst(employeeId: string): Promise<Attendance|null> {
    return this.prisma.attendance.findFirst({
      where: { employee_id: employeeId, clock_out: null },
      orderBy: { clock_in: 'desc' },
    });
  }

  findAllByEmployeeId(employeeId: string): Promise<Attendance[]> {
    return this.prisma.attendance.findMany({
      where: { employee_id: employeeId },
      orderBy: { clock_in: 'desc' },
    });
  }
}