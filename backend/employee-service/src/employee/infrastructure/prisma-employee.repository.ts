import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../domain/employee.repository";
import { PrismaService } from "src/prisma.service";
import { Employee } from "../domain/employee.entity";

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any): Promise<Employee> {
    return this.prisma.employee.create({ data });
  }

  findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  findById(id: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  update(id: string, data: any): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.employee.delete({ where: { id } });
  }
}