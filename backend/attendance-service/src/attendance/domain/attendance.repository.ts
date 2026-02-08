import { Attendance } from "./attendance.entity";

export interface AttendanceRepository {
  clockIn(employeeId: string, photoUrl: string | null, clockIn?: Date): Promise<Attendance>;
  clockOut(id: string, clockOut?: Date): Promise<Attendance>;
  findFirst(employeeId: string): Promise<Attendance|null>;
  findAllByEmployeeId(employeeId: string): Promise<Attendance[]>;
}
